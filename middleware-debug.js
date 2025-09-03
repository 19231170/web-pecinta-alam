import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  // Only run this middleware for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      // Try to get the token
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET || 'dev-secret-key-do-not-use-in-production'
      });
      
      // Log token info for debugging (not in production!)
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEBUG] API Request to ${request.nextUrl.pathname}`);
        console.log(`[DEBUG] Token exists: ${!!token}`);
        if (token) {
          console.log(`[DEBUG] Token role: ${token.role}`);
        }
      }
    } catch (error) {
      console.error('Middleware token error:', error);
    }
  }
  
  // Always continue to the next middleware or route handler
  return NextResponse.next();
}

// This tells Next.js which paths this middleware should run on
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
};
