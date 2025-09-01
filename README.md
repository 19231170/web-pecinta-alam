# MAPALA - Website Organisasi Mahasiswa Pecinta Alam

Website resmi organisasi Mahasiswa Pecinta Alam (MAPALA) yang dibangun menggunakan Next.js 15 dan Tailwind CSS.

![MAPALA Logo](public/mapala-logo.svg)

## ✨ Fitur Utama

### 🏠 **Homepage**
- Hero section yang menarik dengan informasi organisasi
- Statistik organisasi (anggota, kegiatan, pencapaian)
- Testimonial dan call-to-action
- Desain responsive untuk semua device

### 👥 **Pendaftaran Anggota**
- Form pendaftaran online yang lengkap
- Validasi real-time
- Sistem notifikasi menggunakan react-toastify
- Penyimpanan data lokal (dapat diintegrasikan dengan database)
- Tracking status pendaftaran

### 📄 **Template Surat**
- Koleksi template surat untuk keperluan organisasi
- Fitur pencarian dan filter berdasarkan kategori
- Preview dan download template
- Statistik penggunaan template
- Request template baru

### 🛡️ **Panel Admin**
- Dashboard dengan statistik real-time
- Manajemen data pendaftaran
- Approval/rejection system
- Export data ke CSV
- Filter dan pencarian data

### 📱 **Responsive Design**
- Mobile-first approach
- Optimized untuk tablet dan desktop
- Consistent UI/UX di semua device

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **Date Handling**: date-fns
- **Deployment Ready**: Vercel, Netlify, atau hosting lainnya

## 📦 Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd project_organisasi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   ```

4. **Buka browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Struktur Project

```
project_organisasi/
├── app/                          # App directory (Next.js 13+)
│   ├── api/                      # API routes
│   │   ├── pendaftaran/         # Endpoint pendaftaran
│   │   └── template/            # Endpoint template
│   ├── components/              # Reusable components
│   │   ├── Navbar.js           # Navigation component
│   │   └── Footer.js           # Footer component
│   ├── admin/                   # Admin panel pages
│   ├── pendaftaran/            # Registration pages
│   ├── template/               # Template pages
│   ├── tentang/                # About pages
│   ├── globals.css             # Global styles
│   ├── layout.js               # Root layout
│   └── page.js                 # Homepage
├── public/                      # Static assets
│   ├── mapala-logo.svg         # Organization logo
│   └── ...                     # Other assets
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── next.config.mjs             # Next.js configuration
└── README.md                   # Documentation
```

## 🎯 Fitur yang Diimplementasikan

### ✅ Sudah Selesai
- [x] Homepage dengan hero section
- [x] Halaman tentang organisasi
- [x] Form pendaftaran anggota
- [x] Halaman template surat
- [x] Panel admin dasar
- [x] Sistem notifikasi
- [x] Responsive design
- [x] Navigation dan footer
- [x] Local storage untuk demo

### 🔄 Dalam Pengembangan
- [ ] Integrasi database (PostgreSQL/MongoDB)
- [ ] Sistem autentikasi
- [ ] Upload file pendukung
- [ ] Email notifications
- [ ] Payment gateway
- [ ] Advanced admin features

## 🎨 Customization

### Mengubah Warna Theme
Edit file `tailwind.config.js` atau gunakan CSS custom di `globals.css`:

```css
:root {
  --primary-color: #22c55e;    /* Green */
  --secondary-color: #3b82f6;  /* Blue */
  --accent-color: #8b5cf6;     /* Purple */
}
```

### Menambah Template Baru
Edit file `app/template/page.js` dan tambahkan template di array `templates`:

```javascript
{
  id: 9,
  judul: 'Template Baru',
  kategori: 'Kategori Baru',
  deskripsi: 'Deskripsi template',
  // ... properti lainnya
}
```

## 🔧 Konfigurasi

### Environment Variables
Buat file `.env.local` untuk konfigurasi:

```env
# Database (optional)
DATABASE_URL=your_database_url

# Email (optional)
SMTP_HOST=your_smtp_host
SMTP_USER=your_email
SMTP_PASS=your_password

# Auth (optional)
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository di Vercel
3. Deploy otomatis

### Netlify
1. Build project: `npm run build`
2. Upload folder `out` ke Netlify

### Manual Server
1. Build: `npm run build`
2. Start: `npm start`
3. Setup reverse proxy (Nginx)

## 📊 Features Overview

| Feature | Status | Description |
|---------|--------|-------------|
| Landing Page | ✅ | Homepage dengan informasi organisasi |
| About Page | ✅ | Sejarah, visi-misi, nilai organisasi |
| Registration | ✅ | Form pendaftaran online |
| Templates | ✅ | Download template surat |
| Admin Panel | ✅ | Manajemen data pendaftaran |
| Responsive | ✅ | Mobile-friendly design |
| Notifications | ✅ | Toast notifications |
| Search & Filter | ✅ | Pencarian dan filter data |

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Submit pull request

## 📞 Support

Untuk pertanyaan atau bantuan:
- Email: mapala@university.ac.id
- Telepon: +62 857 1548 4773
- Website: [your-domain.com]

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Dibuat dengan ❤️ untuk MAPALA**
