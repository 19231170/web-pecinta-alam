'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Download,
  UserPlus,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminPendaftaran() {
  const [pendaftaranData, setPendaftaranData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPendaftar, setSelectedPendaftar] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('pendaftaran') || '[]');
    setPendaftaranData(data);
  }, []);

  const handleApprove = (id) => {
    const updatedData = pendaftaranData.map(item => 
      item.id === id ? { ...item, status: 'Disetujui', tanggalDisetujui: new Date().toISOString() } : item
    );
    setPendaftaranData(updatedData);
    localStorage.setItem('pendaftaran', JSON.stringify(updatedData));
    
    // Add to anggota list
    const anggotaData = JSON.parse(localStorage.getItem('anggota') || '[]');
    const approvedMember = updatedData.find(item => item.id === id);
    if (approvedMember) {
      anggotaData.push({
        ...approvedMember,
        tanggalBergabung: new Date().toISOString(),
        statusAktif: true
      });
      localStorage.setItem('anggota', JSON.stringify(anggotaData));
    }
    
    toast.success('Pendaftaran telah disetujui');
  };

  const handleReject = (id) => {
    const updatedData = pendaftaranData.map(item => 
      item.id === id ? { ...item, status: 'Ditolak', tanggalDitolak: new Date().toISOString() } : item
    );
    setPendaftaranData(updatedData);
    localStorage.setItem('pendaftaran', JSON.stringify(updatedData));
    toast.success('Pendaftaran telah ditolak');
  };

  const handleViewDetail = (pendaftar) => {
    setSelectedPendaftar(pendaftar);
    setShowDetailModal(true);
  };

  const exportData = () => {
    const csvContent = [
      ['Nama', 'NIM', 'Email', 'Telefon', 'Fakultas', 'Jurusan', 'Status', 'Tanggal Daftar'],
      ...pendaftaranData.map(item => [
        item.nama,
        item.nim,
        item.email,
        item.telefon,
        item.fakultas,
        item.jurusan,
        item.status,
        new Date(item.tanggalDaftar).toLocaleDateString('id-ID')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data_pendaftaran_mapala.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Data berhasil diekspor');
  };

  const filteredData = pendaftaranData.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: pendaftaranData.length,
    menunggu: pendaftaranData.filter(item => item.status === 'Menunggu Verifikasi').length,
    disetujui: pendaftaranData.filter(item => item.status === 'Disetujui').length,
    ditolak: pendaftaranData.filter(item => item.status === 'Ditolak').length
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kelola Pendaftaran</h1>
                <p className="text-gray-600">Manage pendaftaran anggota baru MAPALA</p>
              </div>
              <button
                onClick={exportData}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{stats.total}</h3>
                  <p className="text-sm text-gray-600">Total Pendaftar</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{stats.menunggu}</h3>
                  <p className="text-sm text-gray-600">Menunggu Review</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Check className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{stats.disetujui}</h3>
                  <p className="text-sm text-gray-600">Disetujui</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <X className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{stats.ditolak}</h3>
                  <p className="text-sm text-gray-600">Ditolak</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, NIM, atau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="">Semua Status</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pendaftar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akademik
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                          <div className="text-sm text-gray-500">NIM: {item.nim}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          {item.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          {item.telefon}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.fakultas}</div>
                        <div className="text-sm text-gray-500">{item.jurusan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'Disetujui' ? 'bg-green-100 text-green-800' :
                          item.status === 'Ditolak' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.tanggalDaftar).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetail(item)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {item.status === 'Menunggu Verifikasi' && (
                            <>
                              <button
                                onClick={() => handleApprove(item.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Setujui"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleReject(item.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Tolak"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <UserPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tidak ada data pendaftaran
                </h3>
                <p className="text-gray-600">
                  Belum ada pendaftar atau tidak ada yang sesuai dengan filter
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedPendaftar && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Detail Pendaftar</h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedPendaftar.nama}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">NIM</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedPendaftar.nim}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedPendaftar.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Telefon</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedPendaftar.telefon}</p>
                    </div>
                  </div>
                  
                  {selectedPendaftar.motivasi && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Motivasi</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedPendaftar.motivasi}</p>
                    </div>
                  )}
                  
                  {selectedPendaftar.pengalamanAlam && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pengalaman Alam</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedPendaftar.pengalamanAlam}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  {selectedPendaftar.status === 'Menunggu Verifikasi' && (
                    <>
                      <button
                        onClick={() => {
                          handleReject(selectedPendaftar.id);
                          setShowDetailModal(false);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => {
                          handleApprove(selectedPendaftar.id);
                          setShowDetailModal(false);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Setujui
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
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
