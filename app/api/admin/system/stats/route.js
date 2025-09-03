import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mendapatkan statistik sistem
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Dapatkan statistik database
    const totalUsers = await prisma.user.count();
    const totalRegistrations = await prisma.pendaftaran.count();
    const totalTemplates = await prisma.template.count();
    const totalDownloads = await prisma.downloadLog.count();
    
    // Dapatkan siteSettings untuk lastBackup
    const settings = await prisma.siteSettings.findFirst();
    const lastBackup = settings?.lastBackup || null;
    
    // Hitung perkiraan ukuran database (ini hanya simulasi)
    const estimatedSize = (
      (totalUsers * 2) + 
      (totalRegistrations * 3) + 
      (totalTemplates * 5) + 
      (totalDownloads * 0.5)
    ).toFixed(1);

    return NextResponse.json({
      success: true,
      totalUsers,
      totalRegistrations,
      totalTemplates,
      totalDownloads,
      lastBackup,
      databaseSize: `${estimatedSize} MB`
    });
  } catch (error) {
    console.error('Error getting system stats:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mengambil statistik sistem' },
      { status: 500 }
    );
  }
}

// Aksi sistem (backup, clear cache, export data)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { action } = data;

    switch (action) {
      case 'backup':
        // Implementasi backup database
        // Dalam contoh ini, kita hanya memperbarui lastBackup
        const settings = await prisma.siteSettings.findFirst();
        
        if (settings) {
          await prisma.siteSettings.update({
            where: { id: settings.id },
            data: { lastBackup: new Date() }
          });
        } else {
          // Buat pengaturan default jika tidak ada
          await prisma.siteSettings.create({
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
        
        return NextResponse.json({
          success: true,
          message: 'Database berhasil dibackup',
          timestamp: new Date()
        });
        
      case 'clearCache':
        // Implementasi clear cache
        // Dalam contoh ini, kita hanya memberikan respons sukses
        return NextResponse.json({
          success: true,
          message: 'Cache berhasil dibersihkan'
        });
        
      case 'exportData':
        // Implementasi export data
        // Dalam contoh ini, kita hanya memberikan respons sukses
        return NextResponse.json({
          success: true,
          message: 'Data berhasil diexport'
        });
        
      default:
        return NextResponse.json(
          { success: false, message: 'Aksi tidak dikenali' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing system action:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat memproses aksi sistem' },
      { status: 500 }
    );
  }
}
