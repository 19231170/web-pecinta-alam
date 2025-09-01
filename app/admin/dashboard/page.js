'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  TrendingUp,
  UserPlus,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAnggota: 0,
    pendaftaranBaru: 0,
    templateTersedia: 0,
    aktivitasBulanIni: 5
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load data dari localStorage
      const pendaftaranData = JSON.parse(localStorage.getItem('pendaftaran') || '[]');
      const anggotaData = JSON.parse(localStorage.getItem('anggota') || '[]');
      
      // Load template count from API
      const templateResponse = await fetch('/api/template');
      let templateCount = 0;
      if (templateResponse.ok) {
        const templateData = await templateResponse.json();
        templateCount = templateData.templates?.length || 0;
      }
      
      setStats({
        totalAnggota: anggotaData.length + pendaftaranData.filter(p => p.status === 'Disetujui').length,
        pendaftaranBaru: pendaftaranData.filter(p => p.status === 'Menunggu Verifikasi').length,
        templateTersedia: templateCount,
        aktivitasBulanIni: 5
      });

      // Recent activity
      const activities = pendaftaranData
        .slice(-5)
        .map(item => ({
          id: item.id,
          type: 'pendaftaran',
          message: `${item.nama} mendaftar sebagai anggota`,
          time: new Date(item.tanggalDaftar).toLocaleDateString('id-ID'),
          status: item.status
        }));
      
      setRecentActivity(activities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-gray-600">Selamat datang di panel administrasi MAPALA</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <Settings className="h-4 w-4 inline mr-2" />
                  Pengaturan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{stats.totalAnggota}</h3>
                  <p className="text-sm text-gray-600">Total Anggota</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% dari bulan lalu
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <UserPlus className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{stats.pendaftaranBaru}</h3>
                  <p className="text-sm text-gray-600">Pendaftaran Baru</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-yellow-600">
                <UserPlus className="h-4 w-4 mr-1" />
                Menunggu review
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{stats.templateTersedia}</h3>
                  <p className="text-sm text-gray-600">Template Tersedia</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-purple-600">
                <FileText className="h-4 w-4 mr-1" />
                Siap digunakan
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{stats.aktivitasBulanIni}</h3>
                  <p className="text-sm text-gray-600">Aktivitas Bulan Ini</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2 dari target
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
              </div>
              <div className="p-6">
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          activity.status === 'Disetujui' ? 'bg-green-100' :
                          activity.status === 'Ditolak' ? 'bg-red-100' :
                          'bg-yellow-100'
                        }`}>
                          {activity.status === 'Disetujui' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : activity.status === 'Ditolak' ? (
                            <XCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <UserPlus className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          activity.status === 'Disetujui' ? 'bg-green-100 text-green-800' :
                          activity.status === 'Ditolak' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Belum ada aktivitas terbaru</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Aksi Cepat</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="/admin/pendaftaran"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <UserPlus className="h-8 w-8 text-blue-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Kelola Pendaftaran</h4>
                    <p className="text-xs text-gray-500">Review pendaftar baru</p>
                  </a>

                  <a
                    href="/admin/anggota"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Users className="h-8 w-8 text-green-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Kelola Anggota</h4>
                    <p className="text-xs text-gray-500">Manage data anggota</p>
                  </a>

                  <a
                    href="/admin/template"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FileText className="h-8 w-8 text-purple-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Kelola Template</h4>
                    <p className="text-xs text-gray-500">Tambah/edit template</p>
                  </a>

                  <a
                    href="/admin/settings"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-8 w-8 text-gray-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Pengaturan</h4>
                    <p className="text-xs text-gray-500">Konfigurasi sistem</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
