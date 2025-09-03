import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Password saat ini dan password baru diperlukan' },
        { status: 400 }
      );
    }

    // Cari user admin
    const admin = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin tidak ditemukan' },
        { status: 404 }
      );
    }

    // Verifikasi password saat ini
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Password saat ini tidak valid' },
        { status: 401 }
      );
    }

    // Hash password baru dan perbarui di database
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: { id: admin.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({
      success: true,
      message: 'Password admin berhasil diperbarui'
    });
  } catch (error) {
    console.error('Error updating admin password:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat memperbarui password' },
      { status: 500 }
    );
  }
}
