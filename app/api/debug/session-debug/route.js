import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Simple endpoint to debug the session on the server side
export async function GET(request) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    console.log('Session debug - Raw session:', session);
    console.log('Session debug - Request headers:', Object.fromEntries(request.headers.entries()));
    console.log('Session debug - Cookies:', request.cookies.getAll());
    
    // Return detailed information about the session
    return NextResponse.json({
      success: true,
      hasSession: !!session,
      session: session ? {
        user: {
          id: session.user?.id,
          name: session.user?.name,
          email: session.user?.email,
          role: session.user?.role,
          roleType: typeof session.user?.role,
        },
        expires: session.expires
      } : null,
      headers: Object.fromEntries(request.headers),
      cookies: request.cookies.getAll().map(c => ({ name: c.name, value: c.value }))
    });
  } catch (error) {
    console.error('Error in session-debug API:', error);
    return NextResponse.json(
      { success: false, message: 'Error getting session debug info', error: error.message },
      { status: 500 }
    );
  }
}
