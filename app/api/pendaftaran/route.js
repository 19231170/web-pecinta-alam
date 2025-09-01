import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validasi data
    const requiredFields = ['nama', 'nim', 'email', 'phone', 'jurusan', 'angkatan', 'alamat', 'tanggalLahir', 'jenisKelamin', 'motivasi'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Field berikut harus diisi: ${missingFields.join(', ')}` },
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
        { error: 'Email atau NIM sudah terdaftar' },
        { status: 400 }
      );
    }

    // Cek pendaftaran yang sudah ada
    const existingRegistration = await prisma.pendaftaran.findFirst({
      where: {
        OR: [
          { email: data.email },
          { nim: data.nim }
        ]
      }
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Anda sudah pernah mendaftar sebelumnya' },
        { status: 400 }
      );
    }

    // Create pendaftaran baru
    const pendaftaran = await prisma.pendaftaran.create({
      data: {
        nama: data.nama,
        nim: data.nim,
        email: data.email,
        phone: data.phone,
        jurusan: data.jurusan,
        angkatan: data.angkatan,
        alamat: data.alamat,
        tanggalLahir: new Date(data.tanggalLahir),
        jenisKelamin: data.jenisKelamin,
        skillsKeahlian: data.skillsKeahlian || null,
        motivasi: data.motivasi,
        pengalamanSebelumnya: data.pengalamanSebelumnya || null,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil! Menunggu persetujuan admin.',
      data: {
        id: pendaftaran.id,
        nama: pendaftaran.nama,
        status: pendaftaran.status
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const pendaftaran = await prisma.pendaftaran.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: pendaftaran
    });
  } catch (error) {
    console.error('Fetch registrations error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data pendaftaran' },
      { status: 500 }
    );
  }
}
