export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
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
      if (token) {
        session.user.role = token.role;
        session.user.nim = token.nim;
      }
      return session;
    },
    // The authorized callback is used by the middleware to protect routes.
    // It runs before a request is completed.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/admin') || nextUrl.pathname.startsWith('/anggota');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // If the user is logged in and tries to access login/register pages,
        // redirect them to the dashboard.
        if(nextUrl.pathname.startsWith('/auth/login') || nextUrl.pathname.startsWith('/pendaftaran')) {
            return Response.redirect(new URL('/anggota/dashboard', nextUrl));
        }
      }
      return true;
    },
  },
  providers: [], // Providers are added in the main auth.js file
};