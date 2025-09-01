import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // Validasi data
    const requiredFields = ['name', 'email'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Field berikut harus diisi: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Cek apakah user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Anggota tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cek apakah email atau NIM sudah digunakan user lain
    if (data.email !== existingUser.email || data.nim !== existingUser.nim) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                { email: data.email },
                { nim: data.nim }
              ]
            }
          ]
        }
      });

      if (duplicateUser) {
        return NextResponse.json(
          { success: false, message: 'Email atau NIM sudah digunakan anggota lain' },
          { status: 400 }
        );
      }
    }

    // Update anggota
    const updatedAnggota = await prisma.user.update({
      where: { id: id },
      data: {
        name: data.name,
        email: data.email,
        nim: data.nim || null,
        phone: data.phone || null,
        jurusan: data.jurusan || null,
        angkatan: data.angkatan || null,
        alamat: data.alamat || null,
        posisi: data.posisi || 'Anggota',
        status: data.status || 'AKTIF',
        skillsKeahlian: data.skillsKeahlian || null,
        motivasi: data.motivasi || null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Anggota berhasil diperbarui',
      data: {
        id: updatedAnggota.id,
        name: updatedAnggota.name,
        email: updatedAnggota.email
      }
    });

  } catch (error) {
    console.error('Update anggota error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat memperbarui anggota' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Cek apakah user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Anggota tidak ditemukan' },
        { status: 404 }
      );
    }

    // Hapus anggota
    await prisma.user.delete({
      where: { id: id }
    });

    return NextResponse.json({
      success: true,
      message: 'Anggota berhasil dihapus'
    });

  } catch (error) {
    console.error('Delete anggota error:', error);
    
    // Handle foreign key constraint
    if (error.code === 'P2003') {
      return NextResponse.json(
        { success: false, message: 'Tidak dapat menghapus anggota karena masih memiliki data terkait' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat menghapus anggota' },
      { status: 500 }
    );
  }
}
