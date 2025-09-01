import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email diperlukan' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        nim: true,
        phone: true,
        jurusan: true,
        angkatan: true,
        alamat: true,
        tanggalLahir: true,
        jenisKelamin: true,
        posisi: true,
        skillsKeahlian: true,
        motivasi: true,
        pengalamanSebelumnya: true,
        hobiMinat: true,
        emergencyContact: true,
        emergencyPhone: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mengambil data profil' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { email, password, ...updateData } = data;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email diperlukan' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateFields = { ...updateData };

    // Handle password update if provided
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 12);
      updateFields.password = hashedPassword;
    }

    // Convert date string to Date object if provided
    if (updateFields.tanggalLahir) {
      updateFields.tanggalLahir = new Date(updateFields.tanggalLahir);
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: updateFields,
      select: {
        id: true,
        name: true,
        email: true,
        nim: true,
        phone: true,
        jurusan: true,
        angkatan: true,
        alamat: true,
        tanggalLahir: true,
        jenisKelamin: true,
        posisi: true,
        skillsKeahlian: true,
        motivasi: true,
        pengalamanSebelumnya: true,
        hobiMinat: true,
        emergencyContact: true,
        emergencyPhone: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat memperbarui profil' },
      { status: 500 }
    );
  }
}
