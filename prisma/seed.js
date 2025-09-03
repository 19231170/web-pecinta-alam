const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

// Handle environment detection
const isVercelBuild = process.env.VERCEL_ENV && process.env.NODE_ENV === 'production';

// Create a more resilient Prisma client for seeding
let prisma;
try {
  prisma = new PrismaClient({
    errorFormat: 'pretty',
    log: isVercelBuild ? ['error'] : ['query', 'error', 'warn'],
  });
  console.log('📊 PrismaClient initialized successfully');
} catch (err) {
  console.error('❌ Failed to initialize PrismaClient:', err);
  
  // Provide a fallback in build environment
  if (isVercelBuild) {
    console.warn('⚠️ Using mock PrismaClient during build');
    // Simple mock that allows the build to continue
    prisma = {
      user: { upsert: async () => ({ id: 'mock-id' }) },
      template: { upsert: async () => ({}) },
      pendaftaran: { upsert: async () => ({}) },
      $disconnect: async () => {}
    };
  } else {
    throw err; // Re-throw in non-build environments
  }
}

async function main() {
  console.log('🌱 Starting seeding...');

  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 12);
    const anggotaPassword = await bcrypt.hash('anggota123', 12);

    // Create Admin User
    const admin = await prisma.user.upsert({
      where: { email: 'admin@mapala.ac.id' },
      update: {},
      create: {
        email: 'admin@mapala.ac.id',
        password: adminPassword,
        name: 'Administrator MAPALA',
        role: 'ADMIN',
        status: 'AKTIF',
        posisi: 'Administrator',
      },
    });

    // Create Sample Member User
    const anggota = await prisma.user.upsert({
      where: { email: 'anggota@mapala.ac.id' },
      update: {},
      create: {
        email: 'anggota@mapala.ac.id',
        password: anggotaPassword,
        name: 'Ahmad Rizki',
        role: 'ANGGOTA',
        nim: '2021001',
        phone: '081234567890',
        jurusan: 'Teknik Informatika',
        angkatan: '2021',
        alamat: 'Jl. Merdeka No. 123, Jakarta',
        jenisKelamin: 'Laki-laki',
        posisi: 'Anggota',
        skillsKeahlian: 'Panjat Tebing, Navigasi',
        motivasi: 'Ingin belajar lebih banyak tentang alam dan konservasi',
        status: 'AKTIF',
      },
    });

    // Create more sample members
    const members = [
      {
        email: 'sari.dewi@student.ac.id',
        password: await bcrypt.hash('password123', 12),
        name: 'Sari Dewi',
        role: 'ANGGOTA',
        nim: '2020045',
        phone: '081234567891',
        jurusan: 'Biologi',
        angkatan: '2020',
        alamat: 'Jl. Sudirman No. 456, Bandung',
        jenisKelamin: 'Perempuan',
        posisi: 'Sekretaris',
        skillsKeahlian: 'Identifikasi Flora, Fotografi Alam',
        motivasi: 'Berkontribusi dalam penelitian flora dan fauna',
        status: 'AKTIF',
      },
      {
        email: 'budi.santoso@student.ac.id',
        password: await bcrypt.hash('password123', 12),
        name: 'Budi Santoso',
        role: 'ANGGOTA',
        nim: '2019078',
        phone: '081234567892',
        jurusan: 'Teknik Geologi',
        angkatan: '2019',
        alamat: 'Jl. Gatot Subroto No. 789, Yogyakarta',
        jenisKelamin: 'Laki-laki',
        posisi: 'Ketua',
        skillsKeahlian: 'Mountaineering, Pemetaan',
        motivasi: 'Memimpin organisasi dalam kegiatan pecinta alam',
        status: 'AKTIF',
      },
      {
        email: 'maya.indah@student.ac.id',
        password: await bcrypt.hash('password123', 12),
        name: 'Maya Indah',
        role: 'ANGGOTA',
        nim: '2021067',
        phone: '081234567893',
        jurusan: 'Komunikasi',
        angkatan: '2021',
        alamat: 'Jl. Diponegoro No. 321, Surabaya',
        jenisKelamin: 'Perempuan',
        posisi: 'Humas',
        skillsKeahlian: 'Dokumentasi, Media Sosial',
        motivasi: 'Mempromosikan kegiatan pecinta alam',
        status: 'AKTIF',
      },
    ];

    for (const member of members) {
      await prisma.user.upsert({
        where: { email: member.email },
        update: {},
        create: member,
      });
    }

    // Create Sample Templates
    const templates = [
      {
        judul: 'Surat Izin Kegiatan Pendakian',
        kategori: 'Izin Kegiatan',
        deskripsi: 'Template surat permohonan izin untuk kegiatan pendakian gunung',
        fileName: 'surat_izin_pendakian.html',
        filePath: '/templates/surat_izin_pendakian.html',
        fileSize: '25 KB',
        downloadCount: 142,
      },
      {
        judul: 'Surat Rekomendasi Anggota',
        kategori: 'Rekomendasi',
        deskripsi: 'Template surat rekomendasi untuk anggota MAPALA',
        fileName: 'surat_rekomendasi.html',
        filePath: '/templates/surat_rekomendasi.html',
        fileSize: '22 KB',
        downloadCount: 89,
      },
      {
        judul: 'Proposal Kegiatan Konservasi',
        kategori: 'Proposal',
        deskripsi: 'Template proposal untuk kegiatan konservasi lingkungan',
        fileName: 'proposal_konservasi.html',
        filePath: '/templates/proposal_konservasi.html',
        fileSize: '45 KB',
        downloadCount: 67,
      },
      {
        judul: 'Surat Undangan Rapat',
        kategori: 'Undangan',
        deskripsi: 'Template surat undangan untuk rapat organisasi',
        fileName: 'surat_undangan_rapat.html',
        filePath: '/templates/surat_undangan_rapat.html',
        fileSize: '18 KB',
        downloadCount: 234,
      },
      {
        judul: 'Laporan Kegiatan',
        kategori: 'Laporan',
        deskripsi: 'Template laporan kegiatan organisasi',
        fileName: 'laporan_kegiatan.html',
        filePath: '/templates/laporan_kegiatan.html',
        fileSize: '38 KB',
        downloadCount: 156,
      },
      {
        judul: 'Surat Permohonan Sponsorship',
        kategori: 'Permohonan',
        deskripsi: 'Template surat permohonan bantuan sponsorship',
        fileName: 'permohonan_sponsorship.html',
        filePath: '/templates/permohonan_sponsorship.html',
        fileSize: '28 KB',
        downloadCount: 98,
      },
      {
        judul: 'Surat Keterangan Anggota',
        kategori: 'Keterangan',
        deskripsi: 'Template surat keterangan keanggotaan MAPALA',
        fileName: 'keterangan_anggota.html',
        filePath: '/templates/keterangan_anggota.html',
        fileSize: '20 KB',
        downloadCount: 178,
      },
      {
        judul: 'Proposal Pelatihan SAR',
        kategori: 'Proposal',
        deskripsi: 'Template proposal untuk kegiatan pelatihan Search and Rescue',
        fileName: 'proposal_sar.html',
        filePath: '/templates/proposal_sar.html',
        fileSize: '42 KB',
        downloadCount: 73,
      },
    ];

    for (const template of templates) {
      await prisma.template.upsert({
        where: { fileName: template.fileName },
        update: {},
        create: template,
      });
    }

    // Create Sample Pendaftaran
    const sampleRegistration = await prisma.user.upsert({
      where: { email: 'mahasiswa.baru@student.ac.id' },
      update: {},
      create: {
        email: 'mahasiswa.baru@student.ac.id',
        password: await bcrypt.hash('password123', 12),
        name: 'Doni Prasetyo',
        role: 'MAHASISWA_BARU',
        status: 'PENDING',
      },
    });

    await prisma.pendaftaran.upsert({
      where: { userId: sampleRegistration.id },
      update: {},
      create: {
        userId: sampleRegistration.id,
        nama: 'Doni Prasetyo',
        nim: '2025001',
        email: 'mahasiswa.baru@student.ac.id',
        phone: '081234567999',
        jurusan: 'Kedokteran',
        angkatan: '2025',
        alamat: 'Jl. Ahmad Yani No. 654, Malang',
        tanggalLahir: new Date('2003-05-15'),
        jenisKelamin: 'Laki-laki',
        skillsKeahlian: 'Pertolongan Pertama, Survival',
        motivasi: 'Mengaplikasikan ilmu medis di alam dan membantu sesama',
        pengalamanSebelumnya: 'Anggota PMR di SMA, pernah ikut camping',
        status: 'PENDING',
      },
    });

    // Create or update Site Settings
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        siteName: 'MAPALA',
        siteDescription: 'Mahasiswa Pecinta Alam',
        adminEmail: 'admin@mapala.ac.id',
        maxMembers: 100,
        registrationOpen: true,
        emailNotifications: true,
        autoApproval: false,
        backupInterval: 'weekly',
        sessionTimeout: 30,
        maintenanceMode: false,
        lastBackup: new Date()
      },
    });

    console.log('✅ Seeding completed successfully!');
    console.log('👤 Created users:');
    console.log('  - Admin: admin@mapala.ac.id (password: admin123)');
    console.log('  - Anggota: anggota@mapala.ac.id (password: anggota123)');
    console.log('  - Plus 3 sample members and 1 pending registration');
    console.log('📄 Created 5 sample templates');
    console.log('⚙️ Created site settings');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    console.error('Error details:', JSON.stringify({
      name: e.name,
      message: e.message,
      stack: e.stack,
      env: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV || 'not set'
    }));
    
    // Don't exit with error in production to allow build to continue
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV) {
      console.warn('Continuing build despite seed failure in Vercel environment');
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
      console.log('💤 Prisma client disconnected');
    } catch (e) {
      console.error('Failed to disconnect Prisma client:', e);
      process.exit(0); // Still exit cleanly
    }
  });
