'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Users, Plus, Edit, Trash2, Eye, Search, Filter, UserCheck, UserX, Download } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminAnggota() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nim: '',
    phone: '',
    jurusan: '',
    angkatan: '',
    alamat: '',
    posisi: 'Anggota',
    status: 'AKTIF',
    skillsKeahlian: '',
    motivasi: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/anggota');
      const data = await response.json();
      if (data.success) {
        setMembers(data.data);
      } else {
        toast.error('Gagal mengambil data anggota');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.nim?.includes(searchTerm) ||
                         member.jurusan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.posisi?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      name: '',
      email: '',
      nim: '',
      phone: '',
      jurusan: '',
      angkatan: '',
      alamat: '',
      posisi: 'Anggota',
      status: 'AKTIF',
      skillsKeahlian: '',
      motivasi: ''
    });
    setSelectedMember(null);
    setShowModal(true);
  };

  const handleEdit = (member) => {
    setModalMode('edit');
    setFormData({
      name: member.name || '',
      email: member.email || '',
      nim: member.nim || '',
      phone: member.phone || '',
      jurusan: member.jurusan || '',
      angkatan: member.angkatan || '',
      alamat: member.alamat || '',
      posisi: member.posisi || 'Anggota',
      status: member.status || 'AKTIF',
      skillsKeahlian: member.skillsKeahlian || '',
      motivasi: member.motivasi || ''
    });
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleView = (member) => {
    setModalMode('view');
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleDelete = async (member) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus anggota ${member.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/anggota/${member.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Anggota berhasil dihapus');
        fetchMembers();
      } else {
        toast.error(data.message || 'Gagal menghapus anggota');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Terjadi kesalahan saat menghapus anggota');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = modalMode === 'add' ? '/api/admin/anggota' : `/api/admin/anggota/${selectedMember.id}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(modalMode === 'add' ? 'Anggota berhasil ditambahkan' : 'Anggota berhasil diperbarui');
        setShowModal(false);
        fetchMembers();
      } else {
        toast.error(data.message || `Gagal ${modalMode === 'add' ? 'menambahkan' : 'memperbarui'} anggota`);
      }
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/anggota/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-anggota-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Data anggota berhasil diekspor ke CSV');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Gagal mengekspor data');
    }
  };

  const getMemberStats = () => {
    const total = members.length;
    const aktif = members.filter(m => m.status === 'AKTIF').length;
    const nonAktif = members.filter(m => m.status === 'NON_AKTIF').length;
    const pengurus = members.filter(m => ['Ketua', 'Sekretaris', 'Bendahara', 'Humas'].includes(m.posisi)).length;
    
    return { total, aktif, nonAktif, pengurus };
  };

  const stats = getMemberStats();

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data anggota...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kelola Anggota</h1>
                <p className="text-gray-600">Manajemen data anggota MAPALA</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExport}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
                <button
                  onClick={handleAdd}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Anggota
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Anggota</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Anggota Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.aktif}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <UserX className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Non-Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.nonAktif}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pengurus</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pengurus}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari anggota (nama, NIM, jurusan, posisi)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="">Semua Status</option>
                  <option value="AKTIF">Aktif</option>
                  <option value="NON_AKTIF">Non-Aktif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Anggota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jurusan & Angkatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posisi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.nim}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.jurusan}</div>
                        <div className="text-sm text-gray-500">Angkatan {member.angkatan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          ['Ketua', 'Sekretaris', 'Bendahara', 'Humas'].includes(member.posisi)
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.posisi}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          member.status === 'AKTIF'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.status === 'AKTIF' ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(member)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(member)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(member)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tidak ada anggota yang ditemukan
                </h3>
                <p className="text-gray-600">
                  Coba ubah kata kunci pencarian atau filter status
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {modalMode === 'add' ? 'Tambah Anggota' : 
                     modalMode === 'edit' ? 'Edit Anggota' : 'Detail Anggota'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Tutup</span>
                    ✕
                  </button>
                </div>

                {modalMode === 'view' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nama</label>
                        <p className="text-sm text-gray-900">{selectedMember?.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">NIM</label>
                        <p className="text-sm text-gray-900">{selectedMember?.nim}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{selectedMember?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Telepon</label>
                        <p className="text-sm text-gray-900">{selectedMember?.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Jurusan</label>
                        <p className="text-sm text-gray-900">{selectedMember?.jurusan}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Angkatan</label>
                        <p className="text-sm text-gray-900">{selectedMember?.angkatan}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Alamat</label>
                      <p className="text-sm text-gray-900">{selectedMember?.alamat}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Skills/Keahlian</label>
                      <p className="text-sm text-gray-900">{selectedMember?.skillsKeahlian}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Motivasi</label>
                      <p className="text-sm text-gray-900">{selectedMember?.motivasi}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NIM *</label>
                        <input
                          type="text"
                          required
                          value={formData.nim}
                          onChange={(e) => setFormData({...formData, nim: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan</label>
                        <input
                          type="text"
                          value={formData.jurusan}
                          onChange={(e) => setFormData({...formData, jurusan: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
                        <input
                          type="text"
                          value={formData.angkatan}
                          onChange={(e) => setFormData({...formData, angkatan: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Posisi</label>
                        <select
                          value={formData.posisi}
                          onChange={(e) => setFormData({...formData, posisi: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="Anggota">Anggota</option>
                          <option value="Ketua">Ketua</option>
                          <option value="Sekretaris">Sekretaris</option>
                          <option value="Bendahara">Bendahara</option>
                          <option value="Humas">Humas</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="AKTIF">Aktif</option>
                          <option value="NON_AKTIF">Non-Aktif</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                      <textarea
                        value={formData.alamat}
                        onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills/Keahlian</label>
                      <textarea
                        value={formData.skillsKeahlian}
                        onChange={(e) => setFormData({...formData, skillsKeahlian: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Motivasi</label>
                      <textarea
                        value={formData.motivasi}
                        onChange={(e) => setFormData({...formData, motivasi: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {modalMode === 'add' ? 'Tambah' : 'Simpan'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
