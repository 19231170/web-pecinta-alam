'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { FileText, Download, Eye, Search, Filter, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AnggotaTemplate() {
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['Semua', 'Izin Kegiatan', 'Rekomendasi', 'Proposal', 'Undangan', 'Laporan', 'Permohonan', 'Keterangan'];

  useEffect(() => {
    // Load templates from localStorage
    const defaultTemplates = [
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

    const savedTemplates = JSON.parse(localStorage.getItem('templates') || JSON.stringify(defaultTemplates));
    setTemplates(savedTemplates);
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'Semua' || template.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (template) => {
    // Update download count
    const updatedTemplates = templates.map(t => 
      t.id === template.id ? { ...t, downloadCount: t.downloadCount + 1 } : t
    );
    setTemplates(updatedTemplates);
    localStorage.setItem('templates', JSON.stringify(updatedTemplates));
    
    toast.success(`Mengunduh ${template.judul}...`);
  };

  const handlePreview = (template) => {
    toast.info(`Membuka preview ${template.judul}...`);
  };

  return (
    <ProtectedRoute allowedRoles={['anggota']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Template Surat</h1>
              <p className="text-gray-600">Akses dan unduh template surat untuk keperluan organisasi</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari template surat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
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

          {/* Templates Grid */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <div key={template.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {template.judul}
                      </h3>
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {template.kategori}
                      </span>
                    </div>
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {template.deskripsi}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Update: {new Date(template.tanggalUpdate).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{template.downloadCount} downloads</span>
                      <span className="text-gray-400">{template.fileSize}</span>
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
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Popular Templates */}
          <div className="mt-12 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Template Populer</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {templates
                  .sort((a, b) => b.downloadCount - a.downloadCount)
                  .slice(0, 5)
                  .map((template, index) => (
                    <div key={template.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{template.judul}</h4>
                          <p className="text-sm text-gray-500">{template.kategori}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{template.downloadCount}</div>
                        <div className="text-xs text-gray-500">downloads</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Panduan Penggunaan Template
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Pilih Template</h4>
                  <p className="text-blue-700">Cari dan pilih template yang sesuai kebutuhan</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Download</h4>
                  <p className="text-blue-700">Klik download untuk mengunduh file template</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Edit & Gunakan</h4>
                  <p className="text-blue-700">Sesuaikan konten template dan gunakan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
