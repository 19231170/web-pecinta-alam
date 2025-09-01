import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
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
        token.role = user.role;
        token.nim = user.nim;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.nim = token.nim;
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
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
