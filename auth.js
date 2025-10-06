import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
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

          // Return user object without password
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.toLowerCase(),
            nim: user.nim,
          };
        } catch (error) {
          console.error("Auth error:", error);
          // Return null on error to prevent user from logging in
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // When a user signs in, the `user` object is passed to the `jwt` callback.
      // We add the user's role and nim to the token here.
      if (user) {
        token.role = user.role;
        token.nim = user.nim;
      }
      return token;
    },
    async session({ session, token }) {
      // The session callback receives the token, and we can use it to add properties to the session.
      if (token) {
        session.user.role = token.role;
        session.user.nim = token.nim;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    // You can add other pages like signOut, error, etc.
  },
  // Add a secret for production environments.
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});