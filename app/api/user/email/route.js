import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  try {
    const { currentEmail, newEmail, password } = await request.json();

    if (!currentEmail || !newEmail || !password) {
      return NextResponse.json(
        { success: false, message: 'Email saat ini, email baru, dan password diperlukan' },
        { status: 400 }
      );
    }

    // Check if the new email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser && existingUser.email !== currentEmail) {
      return NextResponse.json(
        { success: false, message: 'Email ini sudah digunakan oleh pengguna lain' },
        { status: 400 }
      );
    }

    // Find the current user
    const user = await prisma.user.findUnique({
      where: { email: currentEmail },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Password tidak valid' },
        { status: 401 }
      );
    }

    // Update email
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { email: newEmail },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Email berhasil diperbarui',
      email: updatedUser.email,
    });
  } catch (error) {
    console.error('Update email error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat memperbarui email' },
      { status: 500 }
    );
  }
}
