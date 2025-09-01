'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, FileText, BarChart3, Eye, Check, X, Search, Filter, Download } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendaftaranData, setPendaftaranData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    // Load data dari localStorage
    const data = JSON.parse(localStorage.getItem('pendaftaran') || '[]');
    setPendaftaranData(data);
  }, []);

  const handleApprove = (id) => {
    const updatedData = pendaftaranData.map(item => 
      item.id === id ? { ...item, status: 'Disetujui' } : item
    );
    setPendaftaranData(updatedData);
    localStorage.setItem('pendaftaran', JSON.stringify(updatedData));
    toast.success('Pendaftaran telah disetujui');
  };

  const handleReject = (id) => {
    const updatedData = pendaftaranData.map(item => 
      item.id === id ? { ...item, status: 'Ditolak' } : item
    );
    setPendaftaranData(updatedData);
    localStorage.setItem('pendaftaran', JSON.stringify(updatedData));
    toast.success('Pendaftaran telah ditolak');
  };

  const filteredData = pendaftaranData.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalPendaftar: pendaftaranData.length,
    menungguVerifikasi: pendaftaranData.filter(item => item.status === 'Menunggu Verifikasi').length,
    disetujui: pendaftaranData.filter(item => item.status === 'Disetujui').length,
    ditolak: pendaftaranData.filter(item => item.status === 'Ditolak').length
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

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 text-indigo-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Panel Admin
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100">
              Kelola data anggota dan pendaftaran MAPALA
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="h-5 w-5 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('pendaftaran')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'pendaftaran'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-5 w-5 inline mr-2" />
              Pendaftaran
            </button>
            <button
              onClick={() => setActiveTab('anggota')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'anggota'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="h-5 w-5 inline mr-2" />
              Anggota
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{stats.totalPendaftar}</h3>
                      <p className="text-sm text-gray-600">Total Pendaftar</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100">
                      <FileText className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{stats.menungguVerifikasi}</h3>
                      <p className="text-sm text-gray-600">Menunggu Verifikasi</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{stats.disetujui}</h3>
                      <p className="text-sm text-gray-600">Disetujui</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100">
                      <X className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{stats.ditolak}</h3>
                      <p className="text-sm text-gray-600">Ditolak</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
                <div className="space-y-4">
                  {pendaftaranData.slice(0, 5).map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">{item.nama}</p>
                        <p className="text-sm text-gray-600">
                          {item.nim} - {new Date(item.tanggalDaftar).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'Disetujui' ? 'bg-green-100 text-green-800' :
                        item.status === 'Ditolak' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pendaftaran Tab */}
          {activeTab === 'pendaftaran' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Data Pendaftaran</h2>
                <button
                  onClick={exportData}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Data
                </button>
              </div>

              {/* Search and Filter */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan nama, NIM, atau email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="relative">
                    <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
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
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NIM
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fakultas
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
                      {filteredData.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                            <div className="text-sm text-gray-500">{item.telefon}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.nim}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.email}
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => console.log('View details:', item)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {item.status === 'Menunggu Verifikasi' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(item.id)}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleReject(item.id)}
                                    className="text-red-600 hover:text-red-900"
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
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
          )}

          {/* Anggota Tab */}
          {activeTab === 'anggota' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Anggota</h2>
              
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Fitur dalam pengembangan
                </h3>
                <p className="text-gray-600">
                  Modul manajemen anggota akan segera tersedia
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
