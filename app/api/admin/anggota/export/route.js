import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const anggota = await prisma.user.findMany({
      where: {
        role: {
          in: ['ANGGOTA', 'ADMIN']
        }
      },
      orderBy: {
        name: 'asc'
      },
      select: {
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
        createdAt: true
      }
    });

    // Escape CSV fields (handle commas and quotes)
    const escapeCSV = (field) => {
      if (field === null || field === undefined) return '';
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Create CSV header
    const headers = [
      'No',
      'Nama',
      'NIM', 
      'Email',
      'Telepon',
      'Jurusan',
      'Angkatan',
      'Alamat',
      'Posisi',
      'Status',
      'Role',
      'Skills/Keahlian',
      'Motivasi',
      'Tanggal Bergabung'
    ];

    // Create CSV content
    let csvContent = headers.join(',') + '\n';

    anggota.forEach((member, index) => {
      const row = [
        index + 1,
        escapeCSV(member.name),
        escapeCSV(member.nim),
        escapeCSV(member.email),
        escapeCSV(member.phone),
        escapeCSV(member.jurusan),
        escapeCSV(member.angkatan),
        escapeCSV(member.alamat),
        escapeCSV(member.posisi),
        escapeCSV(member.status),
        escapeCSV(member.role),
        escapeCSV(member.skillsKeahlian),
        escapeCSV(member.motivasi),
        member.createdAt ? new Date(member.createdAt).toLocaleDateString('id-ID') : ''
      ];
      csvContent += row.join(',') + '\n';
    });

    // Create buffer from CSV content
    const buffer = Buffer.from('\uFEFF' + csvContent, 'utf8'); // BOM for proper UTF-8 encoding

    // Return CSV file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="data-anggota-mapala-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export anggota error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mengekspor data' },
      { status: 500 }
    );
  }
}
