// Konstanta aplikasi MAPALA

export const APP_CONFIG = {
  name: 'MAPALA',
  fullName: 'Mahasiswa Pecinta Alam',
  version: '1.0.0',
  description: 'Website resmi organisasi Mahasiswa Pecinta Alam kampus',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

export const CONTACT_INFO = {
  email: 'mapala@university.ac.id',
  phone: '+62 123 456 7890',
  address: 'Kampus Universitas, Gedung Kemahasiswaan',
  socialMedia: {
    instagram: '@mapala_university',
    facebook: 'MAPALA University',
    twitter: '@mapala_univ'
  }
};

export const ORGANIZATION_STATS = {
  membersCount: 150,
  mountainsClimbed: 50,
  activitiesPerYear: 25,
  yearsEstablished: 10
};

export const STATUS_OPTIONS = [
  { value: 'Menunggu Verifikasi', label: 'Menunggu Verifikasi', color: 'yellow' },
  { value: 'Disetujui', label: 'Disetujui', color: 'green' },
  { value: 'Ditolak', label: 'Ditolak', color: 'red' }
];

export const TEMPLATE_CATEGORIES = [
  'Izin Kegiatan',
  'Rekomendasi', 
  'Proposal',
  'Undangan',
  'Laporan',
  'Permohonan',
  'Keterangan'
];

export const FAKULTAS_OPTIONS = [
  'Teknik',
  'Ekonomi dan Bisnis',
  'Ilmu Komputer',
  'Kedokteran',
  'Hukum',
  'Pertanian',
  'Psikologi',
  'Ilmu Sosial dan Politik',
  'Matematika dan Ilmu Pengetahuan Alam',
  'Lainnya'
];

export const SEMESTER_OPTIONS = [
  { value: 1, label: 'Semester 1' },
  { value: 2, label: 'Semester 2' },
  { value: 3, label: 'Semester 3' },
  { value: 4, label: 'Semester 4' },
  { value: 5, label: 'Semester 5' },
  { value: 6, label: 'Semester 6' },
  { value: 7, label: 'Semester 7' },
  { value: 8, label: 'Semester 8' }
];

export const NAVIGATION_MENU = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang', label: 'Tentang Kami' },
  { href: '/pendaftaran', label: 'Pendaftaran' },
  { href: '/template', label: 'Template Surat' },
  { href: '/admin', label: 'Admin' }
];

export const ORGANIZATION_VALUES = [
  {
    title: 'Cinta Alam',
    description: 'Memiliki kecintaan mendalam terhadap alam dan berkomitmen untuk melestarikannya bagi generasi mendatang.',
    icon: 'Mountain'
  },
  {
    title: 'Kekeluargaan', 
    description: 'Membangun hubungan yang erat antar anggota dengan semangat gotong royong dan saling mendukung.',
    icon: 'Users'
  },
  {
    title: 'Prestasi',
    description: 'Selalu berusaha memberikan yang terbaik dalam setiap kegiatan dan mencapai prestasi yang membanggakan.',
    icon: 'Award'
  }
];

export const KEGIATAN_RUTIN = [
  {
    title: 'Pendakian Gunung',
    description: 'Eksplorasi gunung-gunung di Indonesia dengan program pendakian rutin setiap bulan.'
  },
  {
    title: 'Pelatihan SAR',
    description: 'Pelatihan Search and Rescue untuk mengembangkan kemampuan pertolongan darurat.'
  },
  {
    title: 'Konservasi Alam',
    description: 'Program pelestarian lingkungan seperti penanaman pohon dan pembersihan sungai.'
  },
  {
    title: 'Pengabdian Masyarakat',
    description: 'Kegiatan sosial untuk membantu masyarakat di daerah terpencil dan pegunungan.'
  }
];

export const API_ENDPOINTS = {
  pendaftaran: '/api/pendaftaran',
  template: '/api/template',
  admin: '/api/admin'
};

export const STORAGE_KEYS = {
  pendaftaran: 'mapala_pendaftaran',
  templates: 'mapala_templates',
  adminAuth: 'mapala_admin_auth'
};

export const TOAST_CONFIG = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true
};
