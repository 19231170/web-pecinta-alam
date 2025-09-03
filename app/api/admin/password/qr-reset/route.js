import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// QR Code Password Reset API Endpoint
export async function POST(request) {
  try {
    // Check session and authentication
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admin can use this endpoint
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin role required' },
        { status: 403 }
      );
    }

    // Get request body
    const data = await request.json();
    const { qrCode } = data;

    if (!qrCode) {
      return NextResponse.json(
        { success: false, message: 'QR code is required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would validate the QR code against
    // a pre-generated secret stored in the database or elsewhere
    // For this example, we'll accept any QR code and generate a new password

    // Generate a new secure password
    const newPassword = generateSecurePassword();
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the admin user's password
    const userId = session.user.id;
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Return the new password (in a real app, you might want to send this via email instead)
    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      newPassword: newPassword, // Note: In production, consider more secure ways to transmit the new password
    });
  } catch (error) {
    console.error('Error in QR code password reset:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during password reset' },
      { status: 500 }
    );
  }
}

// Helper function to generate a secure random password
function generateSecurePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let password = '';
  
  // Create a typed array of random values
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  // Use those random values to select characters from the charset
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  
  return password;
}
