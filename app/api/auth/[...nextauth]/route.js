import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

// Handle build-time vs runtime detection - improved detection for Vercel environment
const isBuildTime = 
  // Standard build detection
  (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) ||
  // Vercel-specific build detection
  (process.env.VERCEL_ENV && process.env.NEXT_PHASE === 'phase-production-build') ||
  // Additional build environment signals
  (process.env.npm_lifecycle_script && process.env.npm_lifecycle_script.includes('next build'));

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Skip actual DB operations during build time
        if (isBuildTime) {
          console.log("Build-time auth request - skipping database operations");
          return null;
        }
        
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.toLowerCase(),
            nim: user.nim
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Safely set properties with fallbacks
        token.role = user.role || 'anggota';
        token.nim = user.nim || null;
      }
      return token;
    },
    async session({ session, token }) {
      // Make sure session.user exists
      if (!session.user) session.user = {};
      
      // Safely set properties with fallbacks
      session.user.role = token.role || 'anggota';
      session.user.nim = token.nim || null;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects properly in both development and production
      if (url.startsWith('/')) {
        // For relative URLs, use the base URL
        return `${baseUrl}${url}`;
      } 
      // For absolute URLs, check if they're from our domain
      else if (new URL(url).origin === baseUrl || 
              (process.env.NODE_ENV === 'development' && new URL(url).hostname === 'localhost')) {
        return url;
      }
      // Default fallback
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
  },
  // Always use NEXTAUTH_SECRET in production, but provide fallback for dev/build
  secret: process.env.NEXTAUTH_SECRET || 
          (process.env.NODE_ENV === 'production' 
            ? undefined  // This will cause a clear error in production if missing
            : 'dev-secret-key-do-not-use-in-production'),
};

// Wrap the handler in a try/catch to prevent build errors
let handler;
try {
  handler = NextAuth(authOptions);
} catch (error) {
  console.error("NextAuth initialization error:", error);
  
  // Provide a fallback handler that returns an error for any auth request
  // This helps prevent build failures while still showing a clear error at runtime
  handler = async (req, res) => {
    return new Response(
      JSON.stringify({ error: "Authentication system configuration error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  };
}

export { handler as GET, handler as POST };
