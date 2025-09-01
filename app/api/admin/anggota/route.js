import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const anggota = await prisma.user.findMany({
      where: {
        role: {
          in: ['ANGGOTA', 'ADMIN']
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        nim: true,
        phone: true,
        jurusan: true,
        angkatan: true,
        alamat: true,
        posisi: true,
        status: true,
        skillsKeahlian: true,
        motivasi: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: anggota
    });
  } catch (error) {
    console.error('Fetch anggota error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mengambil data anggota' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validasi data
    const requiredFields = ['name', 'email', 'nim'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Field berikut harus diisi: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Cek apakah email atau NIM sudah terdaftar
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { nim: data.nim }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email atau NIM sudah terdaftar' },
        { status: 400 }
      );
    }

    // Generate password default
    const defaultPassword = await bcrypt.hash('password123', 12);

    // Create anggota baru
    const newAnggota = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: defaultPassword,
        nim: data.nim,
        phone: data.phone || null,
        jurusan: data.jurusan || null,
        angkatan: data.angkatan || null,
        alamat: data.alamat || null,
        posisi: data.posisi || 'Anggota',
        status: data.status || 'AKTIF',
        skillsKeahlian: data.skillsKeahlian || null,
        motivasi: data.motivasi || null,
        role: 'ANGGOTA'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Anggota berhasil ditambahkan dengan password default: password123',
      data: {
        id: newAnggota.id,
        name: newAnggota.name,
        email: newAnggota.email
      }
    });

  } catch (error) {
    console.error('Create anggota error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat menambahkan anggota' },
      { status: 500 }
    );
  }
}
