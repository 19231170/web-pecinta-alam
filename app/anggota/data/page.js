'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Users, Search, Filter, Mail, Phone, MapPin, Calendar, Eye, UserCheck, UserX } from 'lucide-react';

export default function AnggotaData() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Load members from localStorage
    const defaultMembers = [
      {
        id: 1,
        nama: 'Ahmad Rizki',
        nim: '2021001',
        email: 'ahmad.rizki@student.ac.id',
        phone: '081234567890',
        jurusan: 'Teknik Informatika',
        angkatan: '2021',
        alamat: 'Jl. Merdeka No. 123, Jakarta',
        tanggalDaftar: '2021-09-15',
        status: 'aktif',
        posisi: 'Anggota',
        skillsKeahlian: 'Panjat Tebing, Navigasi',
        motivasi: 'Ingin belajar lebih banyak tentang alam dan konservasi'
      },
      {
        id: 2,
        nama: 'Sari Dewi',
        nim: '2020045',
        email: 'sari.dewi@student.ac.id',
        phone: '081234567891',
        jurusan: 'Biologi',
        angkatan: '2020',
        alamat: 'Jl. Sudirman No. 456, Bandung',
        tanggalDaftar: '2020-08-22',
        status: 'aktif',
        posisi: 'Sekretaris',
        skillsKeahlian: 'Identifikasi Flora, Fotografi Alam',
        motivasi: 'Berkontribusi dalam penelitian flora dan fauna'
      },
      {
        id: 3,
        nama: 'Budi Santoso',
        nim: '2019078',
        email: 'budi.santoso@student.ac.id',
        phone: '081234567892',
        jurusan: 'Teknik Geologi',
        angkatan: '2019',
        alamat: 'Jl. Gatot Subroto No. 789, Yogyakarta',
        tanggalDaftar: '2019-09-10',
        status: 'aktif',
        posisi: 'Ketua',
        skillsKeahlian: 'Mountaineering, Pemetaan',
        motivasi: 'Memimpin organisasi dalam kegiatan pecinta alam'
      },
      {
        id: 4,
        nama: 'Maya Indah',
        nim: '2021067',
        email: 'maya.indah@student.ac.id',
        phone: '081234567893',
        jurusan: 'Komunikasi',
        angkatan: '2021',
        alamat: 'Jl. Diponegoro No. 321, Surabaya',
        tanggalDaftar: '2021-10-05',
        status: 'aktif',
        posisi: 'Humas',
        skillsKeahlian: 'Dokumentasi, Media Sosial',
        motivasi: 'Mempromosikan kegiatan pecinta alam'
      },
      {
        id: 5,
        nama: 'Doni Prasetyo',
        nim: '2022012',
        email: 'doni.prasetyo@student.ac.id',
        phone: '081234567894',
        jurusan: 'Kedokteran',
        angkatan: '2022',
        alamat: 'Jl. Ahmad Yani No. 654, Malang',
        tanggalDaftar: '2022-03-18',
        status: 'aktif',
        posisi: 'Anggota',
        skillsKeahlian: 'Pertolongan Pertama, Survival',
        motivasi: 'Mengaplikasikan ilmu medis di alam'
      },
      {
        id: 6,
        nama: 'Lina Kartika',
        nim: '2020089',
        email: 'lina.kartika@student.ac.id',
        phone: '081234567895',
        jurusan: 'Manajemen',
        angkatan: '2020',
        alamat: 'Jl. Veteran No. 987, Semarang',
        tanggalDaftar: '2020-11-12',
        status: 'non-aktif',
        posisi: 'Bendahara',
        skillsKeahlian: 'Manajemen Keuangan, Logistik',
        motivasi: 'Mengelola keuangan organisasi dengan baik'
      }
    ];

    const savedMembers = JSON.parse(localStorage.getItem('members') || JSON.stringify(defaultMembers));
    setMembers(savedMembers);
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.nim.includes(searchTerm) ||
                         member.jurusan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.posisi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const getMemberStats = () => {
    const total = members.length;
    const aktif = members.filter(m => m.status === 'aktif').length;
    const nonAktif = members.filter(m => m.status === 'non-aktif').length;
    const pengurus = members.filter(m => ['Ketua', 'Sekretaris', 'Bendahara', 'Humas'].includes(m.posisi)).length;
    
    return { total, aktif, nonAktif, pengurus };
  };

  const stats = getMemberStats();

  return (
    <ProtectedRoute allowedRoles={['anggota']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Anggota</h1>
              <p className="text-gray-600">Informasi lengkap anggota MAPALA</p>
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
                  <option value="aktif">Aktif</option>
                  <option value="non-aktif">Non-Aktif</option>
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
                      Tanggal Daftar
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
                          <div className="text-sm font-medium text-gray-900">{member.nama}</div>
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
                          member.status === 'aktif'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.status === 'aktif' ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(member.tanggalDaftar).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetail(member)}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </button>
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

        {/* Detail Modal */}
        {showModal && selectedMember && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Detail Anggota</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Tutup</span>
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                      <p className="text-sm text-gray-900">{selectedMember.nama}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                      <p className="text-sm text-gray-900">{selectedMember.nim}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan</label>
                      <p className="text-sm text-gray-900">{selectedMember.jurusan}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
                      <p className="text-sm text-gray-900">{selectedMember.angkatan}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Informasi Kontak</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{selectedMember.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{selectedMember.phone}</span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-0.5" />
                        <span className="text-sm text-gray-900">{selectedMember.alamat}</span>
                      </div>
                    </div>
                  </div>

                  {/* Organizational Info */}
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Informasi Organisasi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Posisi</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          ['Ketua', 'Sekretaris', 'Bendahara', 'Humas'].includes(selectedMember.posisi)
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedMember.posisi}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedMember.status === 'aktif'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedMember.status === 'aktif' ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Bergabung</label>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(selectedMember.tanggalDaftar).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills & Motivation */}
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Skills & Motivasi</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Skills/Keahlian</label>
                        <p className="text-sm text-gray-900">{selectedMember.skillsKeahlian}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Motivasi</label>
                        <p className="text-sm text-gray-900">{selectedMember.motivasi}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
