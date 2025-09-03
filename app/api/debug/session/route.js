import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Return the session without sensitive data
    return NextResponse.json({
      success: true,
      authenticated: !!session,
      session: session ? {
        user: {
          email: session.user?.email,
          name: session.user?.name,
          role: session.user?.role,
          // Don't return sensitive fields like id
        },
        expires: session.expires
      } : null
    });
  } catch (error) {
    console.error('Error getting debug session info:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving session information' },
      { status: 500 }
    );
  }
}
