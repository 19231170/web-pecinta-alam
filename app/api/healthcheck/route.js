import { NextResponse } from 'next/server';

// This endpoint helps verify that environment variables 
// are properly configured in production

export async function GET() {
  // Check important environment variables
  const envStatus = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
    NODE_ENV: process.env.NODE_ENV,
    // Add any other important env vars here
  };

  // Don't expose actual values, just whether they're set
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    envVarsConfigured: envStatus,
  });
}
