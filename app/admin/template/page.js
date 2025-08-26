'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  FileText,
  Save,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminTemplate() {
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    deskripsi: '',
    content: ''
  });

  const categories = [
    'Izin Kegiatan',
    'Rekomendasi', 
    'Proposal',
    'Undangan',
    'Laporan',
    'Permohonan',
    'Keterangan'
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const defaultTemplates = [
      {
        id: 1,
        judul: 'Surat Izin Kegiatan Pendakian',
        kategori: 'Izin Kegiatan',
        deskripsi: 'Template surat permohonan izin untuk kegiatan pendakian gunung',
        tanggalUpdate: '2025-01-15',
        fileSize: '25 KB',
        downloadCount: 142,
        content: `SURAT IZIN KEGIATAN PENDAKIAN

Kepada Yth.
[Nama Pihak yang Dituju]
[Alamat]

Dengan hormat,

Yang bertanda tangan di bawah ini:
Nama        : [Nama Ketua Pelaksana]
Jabatan     : [Jabatan]
Organisasi  : Mahasiswa Pecinta Alam (MAPALA)

Dengan ini mengajukan permohonan izin untuk melaksanakan kegiatan pendakian dengan rincian sebagai berikut:

1. Nama Kegiatan    : [Nama Kegiatan]
2. Tempat           : [Lokasi Pendakian]
3. Waktu            : [Tanggal] - [Tanggal]
4. Jumlah Peserta   : [Jumlah] orang
5. Tujuan           : [Tujuan Kegiatan]

Demikian surat permohonan ini kami buat. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.

Hormat kami,

[Nama]
[Jabatan]`
      },
      {
        id: 2,
        judul: 'Surat Rekomendasi Anggota',
        kategori: 'Rekomendasi',
        deskripsi: 'Template surat rekomendasi untuk anggota MAPALA',
        tanggalUpdate: '2025-01-10',
        fileSize: '22 KB',
        downloadCount: 89,
        content: `SURAT REKOMENDASI

Yang bertanda tangan di bawah ini:
Nama        : [Nama Pemberi Rekomendasi]
Jabatan     : [Jabatan di MAPALA]

Dengan ini memberikan rekomendasi kepada:
Nama        : [Nama yang Direkomendasikan]
NIM         : [NIM]
Fakultas    : [Fakultas]
Jurusan     : [Jurusan]

Bahwa yang bersangkutan adalah anggota aktif MAPALA yang memiliki:
- Karakter yang baik dan bertanggung jawab
- Komitmen tinggi terhadap organisasi
- Kemampuan bekerja dalam tim
- Pengalaman kegiatan alam yang memadai

Demikian surat rekomendasi ini dibuat untuk dapat dipergunakan sebagaimana mestinya.

[Kota], [Tanggal]

[Nama]
[Jabatan]`
      }
    ];

    const savedTemplates = JSON.parse(localStorage.getItem('templates') || JSON.stringify(defaultTemplates));
    setTemplates(savedTemplates);
  };

  const saveTemplates = (templatesData) => {
    localStorage.setItem('templates', JSON.stringify(templatesData));
    setTemplates(templatesData);
  };

  const handleAddNew = () => {
    setEditingTemplate(null);
    setFormData({
      judul: '',
      kategori: '',
      deskripsi: '',
      content: ''
    });
    setShowModal(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      judul: template.judul,
      kategori: template.kategori,
      deskripsi: template.deskripsi,
      content: template.content
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus template ini?')) {
      const updatedTemplates = templates.filter(template => template.id !== id);
      saveTemplates(updatedTemplates);
      toast.success('Template berhasil dihapus');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.judul || !formData.kategori || !formData.deskripsi || !formData.content) {
      toast.error('Semua field harus diisi');
      return;
    }

    let updatedTemplates;
    
    if (editingTemplate) {
      // Update existing template
      updatedTemplates = templates.map(template => 
        template.id === editingTemplate.id 
          ? {
              ...template,
              ...formData,
              tanggalUpdate: new Date().toISOString().split('T')[0],
              fileSize: Math.round(formData.content.length / 1024) + ' KB'
            }
          : template
      );
      toast.success('Template berhasil diperbarui');
    } else {
      // Add new template
      const newTemplate = {
        id: Date.now(),
        ...formData,
        tanggalUpdate: new Date().toISOString().split('T')[0],
        fileSize: Math.round(formData.content.length / 1024) + ' KB',
        downloadCount: 0
      };
      updatedTemplates = [...templates, newTemplate];
      toast.success('Template berhasil ditambahkan');
    }

    saveTemplates(updatedTemplates);
    setShowModal(false);
  };

  const filteredTemplates = templates.filter(template => 
    template.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kelola Template</h1>
                <p className="text-gray-600">Manage template surat MAPALA</p>
              </div>
              <button
                onClick={handleAddNew}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Template
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div>Update: {new Date(template.tanggalUpdate).toLocaleDateString('id-ID')}</div>
                  <div>{template.downloadCount} downloads • {template.fileSize}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(template)}
                    className="flex-1 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tidak ada template yang ditemukan
              </h3>
              <p className="text-gray-600">
                Coba ubah kata kunci pencarian atau tambah template baru
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingTemplate ? 'Edit Template' : 'Tambah Template Baru'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judul Template *
                      </label>
                      <input
                        type="text"
                        value={formData.judul}
                        onChange={(e) => setFormData({...formData, judul: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan judul template"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori *
                      </label>
                      <select
                        value={formData.kategori}
                        onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Pilih kategori</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi *
                    </label>
                    <textarea
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Masukkan deskripsi template"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konten Template *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows={15}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                      placeholder="Masukkan konten template surat..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Gunakan [Field] untuk placeholder yang dapat diisi pengguna
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {editingTemplate ? 'Update' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
