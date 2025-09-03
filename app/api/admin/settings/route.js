import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mendapatkan pengaturan sistem
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Admin settings API - Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userRole: session?.user?.role,
      userEmail: session?.user?.email
    });
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      console.log('Admin settings API - Unauthorized access attempt');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Cari siteSettings dalam database atau buat default jika tidak ada
    let settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      // Buat pengaturan default jika tidak ada
      settings = await prisma.siteSettings.create({
        data: {
          siteName: 'MAPALA',
          siteDescription: 'Mahasiswa Pecinta Alam',
          adminEmail: session.user.email,
          maxMembers: 100,
          registrationOpen: true,
          emailNotifications: true,
          autoApproval: false,
          backupInterval: 'weekly',
          sessionTimeout: 30,
          maintenanceMode: false,
          lastBackup: new Date()
        }
      });
    }

    // Dapatkan statistik database
    const totalUsers = await prisma.user.count();
    const totalRegistrations = await prisma.pendaftaran.count();
    const totalTemplates = await prisma.template.count();
    
    // Ambil jumlah download dari tabel DownloadLog jika ada
    let totalDownloads = 0;
    try {
      totalDownloads = await prisma.downloadLog.count();
    } catch (error) {
      console.log('DownloadLog table might not exist');
    }

    return NextResponse.json({
      success: true,
      settings,
      stats: {
        totalUsers,
        totalRegistrations,
        totalTemplates,
        totalDownloads,
        databaseSize: '2.5 MB', // Nilai placeholder, bisa diganti dengan kalkulasi sebenarnya
        lastBackup: settings.lastBackup
      }
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mengambil pengaturan' },
      { status: 500 }
    );
  }
}

// Memperbarui pengaturan sistem
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Admin settings PUT API - Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userRole: session?.user?.role,
      userEmail: session?.user?.email
    });
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      console.log('Admin settings PUT API - Unauthorized access attempt');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validasi data pengaturan
    const { siteName, adminEmail } = data;
    
    if (!siteName || !adminEmail) {
      return NextResponse.json(
        { success: false, message: 'Nama situs dan email admin diperlukan' },
        { status: 400 }
      );
    }

    // Perbarui atau buat pengaturan
    const settings = await prisma.siteSettings.upsert({
      where: {
        id: 1
      },
      update: data,
      create: {
        ...data,
        lastBackup: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Pengaturan berhasil disimpan',
      settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat menyimpan pengaturan' },
      { status: 500 }
    );
  }
}
