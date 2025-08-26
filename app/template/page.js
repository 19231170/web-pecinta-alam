'use client';

import { useState } from 'react';
import { FileText, Download, Eye, Search, Filter, Calendar, User } from 'lucide-react';
import { toast } from 'react-toastify';

export default function TemplatePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const templates = [
    {
      id: 1,
      judul: 'Surat Izin Kegiatan Pendakian',
      kategori: 'Izin Kegiatan',
      deskripsi: 'Template surat permohonan izin untuk kegiatan pendakian gunung',
      tanggalUpdate: '2025-01-15',
      fileSize: '25 KB',
      downloadCount: 142
    },
    {
      id: 2,
      judul: 'Surat Rekomendasi Anggota',
      kategori: 'Rekomendasi',
      deskripsi: 'Template surat rekomendasi untuk anggota MAPALA',
      tanggalUpdate: '2025-01-10',
      fileSize: '22 KB',
      downloadCount: 89
    },
    {
      id: 3,
      judul: 'Proposal Kegiatan Konservasi',
      kategori: 'Proposal',
      deskripsi: 'Template proposal untuk kegiatan konservasi lingkungan',
      tanggalUpdate: '2025-01-08',
      fileSize: '45 KB',
      downloadCount: 67
    },
    {
      id: 4,
      judul: 'Surat Undangan Rapat',
      kategori: 'Undangan',
      deskripsi: 'Template surat undangan untuk rapat organisasi',
      tanggalUpdate: '2025-01-05',
      fileSize: '18 KB',
      downloadCount: 234
    },
    {
      id: 5,
      judul: 'Laporan Kegiatan',
      kategori: 'Laporan',
      deskripsi: 'Template laporan kegiatan organisasi',
      tanggalUpdate: '2024-12-28',
      fileSize: '38 KB',
      downloadCount: 156
    },
    {
      id: 6,
      judul: 'Surat Permohonan Sponsorship',
      kategori: 'Permohonan',
      deskripsi: 'Template surat permohonan bantuan sponsorship',
      tanggalUpdate: '2024-12-25',
      fileSize: '28 KB',
      downloadCount: 98
    },
    {
      id: 7,
      judul: 'Surat Keterangan Anggota',
      kategori: 'Keterangan',
      deskripsi: 'Template surat keterangan keanggotaan MAPALA',
      tanggalUpdate: '2024-12-20',
      fileSize: '20 KB',
      downloadCount: 178
    },
    {
      id: 8,
      judul: 'Proposal Pelatihan SAR',
      kategori: 'Proposal',
      deskripsi: 'Template proposal untuk kegiatan pelatihan Search and Rescue',
      tanggalUpdate: '2024-12-15',
      fileSize: '42 KB',
      downloadCount: 73
    }
  ];

  const categories = ['Semua', 'Izin Kegiatan', 'Rekomendasi', 'Proposal', 'Undangan', 'Laporan', 'Permohonan', 'Keterangan'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'Semua' || template.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (template) => {
    // Simulasi download file
    toast.success(`Mengunduh ${template.judul}...`);
    
    // Update download count (dalam aplikasi nyata, ini akan disimpan ke database)
    console.log(`Downloaded: ${template.judul}`);
  };

  const handlePreview = (template) => {
    toast.info(`Membuka preview ${template.judul}...`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto mb-6 text-purple-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Template Surat
            </h1>
            <p className="text-xl md:text-2xl text-purple-100">
              Koleksi template surat untuk keperluan organisasi
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari template surat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'Semua' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak ada template yang ditemukan
              </h3>
              <p className="text-gray-600">
                Coba ubah kata kunci pencarian atau filter kategori
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map(template => (
                <div key={template.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {template.judul}
                      </h3>
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {template.kategori}
                      </span>
                    </div>
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {template.deskripsi}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Update: {new Date(template.tanggalUpdate).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{template.downloadCount} downloads</span>
                    </div>
                    <div className="text-gray-400">
                      Ukuran: {template.fileSize}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(template)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleDownload(template)}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Statistik Template
            </h2>
            <p className="text-xl text-purple-100">
              Data penggunaan template surat MAPALA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{templates.length}</div>
              <div className="text-purple-200">Total Template</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {templates.reduce((sum, template) => sum + template.downloadCount, 0)}
              </div>
              <div className="text-purple-200">Total Download</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{categories.length - 1}</div>
              <div className="text-purple-200">Kategori</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-purple-200">Rating Kepuasan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cara Menggunakan Template
            </h2>
            <p className="text-xl text-gray-600">
              Panduan mudah menggunakan template surat MAPALA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Pilih Template</h3>
              <p className="text-gray-600 text-sm">
                Cari dan pilih template yang sesuai dengan kebutuhan surat Anda
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Download File</h3>
              <p className="text-gray-600 text-sm">
                Klik tombol download untuk mengunduh template dalam format Word atau PDF
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Edit & Gunakan</h3>
              <p className="text-gray-600 text-sm">
                Buka file dan sesuaikan konten sesuai kebutuhan, lalu gunakan untuk keperluan Anda
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Request Template */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="h-16 w-16 text-purple-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Butuh Template Khusus?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Tidak menemukan template yang Anda cari? Kirimkan permintaan template baru kepada kami.
          </p>
          <button className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors">
            Request Template Baru
          </button>
        </div>
      </section>
    </div>
  );
}
