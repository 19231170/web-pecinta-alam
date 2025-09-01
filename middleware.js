import { NextResponse } from 'next/server';

export function middleware(request) {
  // This middleware helps debug issues by exposing environment information
  // You can remove it after deployment is working correctly
  
  // Continue to the requested page
  return NextResponse.next();
}

// This will run the middleware on all paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
