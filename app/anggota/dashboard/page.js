'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useSession } from 'next-auth/react';
import { 
  Users, 
  FileText, 
  Calendar,
  Award,
  Mountain,
  Download,
  TrendingUp,
  Activity,
  Settings
} from 'lucide-react';

export default function AnggotaDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalAnggota: 0,
    templateTersedia: 8,
    kegiatanBulanIni: 3,
    downloadBulanIni: 12
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Load data untuk statistik
        const anggotaData = JSON.parse(localStorage.getItem('anggota') || '[]');
        const pendaftaranData = JSON.parse(localStorage.getItem('pendaftaran') || '[]');
        const approvedMembers = pendaftaranData.filter(p => p.status === 'Disetujui');
        
        // Fetch template count from API
        const templateResponse = await fetch('/api/template');
        let templateCount = 0;
        if (templateResponse.ok) {
          const templateData = await templateResponse.json();
          templateCount = templateData.templates?.length || 0;
        }
        
        setStats({
          totalAnggota: anggotaData.length + approvedMembers.length,
          templateTersedia: templateCount,
          kegiatanBulanIni: 3,
          downloadBulanIni: 12
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    }
    
    loadData();

    // Recent activities
    const activities = [
      {
        id: 1,
        type: 'download',
        message: 'Anda mengunduh template Surat Izin Kegiatan',
        time: '2 jam yang lalu',
        icon: Download
      },
      {
        id: 2,
        type: 'activity',
        message: 'Kegiatan Pendakian Gunung Gede telah selesai',
        time: '1 hari yang lalu',
        icon: Mountain
      },
      {
        id: 3,
        type: 'template',
        message: 'Template baru "Surat Permohonan Sponsorship" telah ditambahkan',
        time: '3 hari yang lalu',
        icon: FileText
      }
    ];
    setRecentActivities(activities);

    // Upcoming events
    const events = [
      {
        id: 1,
        title: 'Pendakian Gunung Semeru',
        date: '2025-02-15',
        participants: 15,
        status: 'Pendaftaran Dibuka'
      },
      {
        id: 2,
        title: 'Pelatihan SAR Dasar',
        date: '2025-02-20',
        participants: 25,
        status: 'Segera Dimulai'
      },
      {
        id: 3,
        title: 'Konservasi Mangrove',
        date: '2025-02-25',
        participants: 20,
        status: 'Pendaftaran Dibuka'
      }
    ];
    setUpcomingEvents(events);
  }, []);

  return (
    <ProtectedRoute allowedRoles={['anggota']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Selamat datang, {session?.user?.name}!
                </h1>
                <p className="text-gray-600">Dashboard anggota MAPALA</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Anggota Aktif
                </div>
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
              <div className="mt-4 flex items-center text-sm text-blue-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                Komunitas aktif
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
                Siap diunduh
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{stats.kegiatanBulanIni}</h3>
                  <p className="text-sm text-gray-600">Kegiatan Bulan Ini</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <Mountain className="h-4 w-4 mr-1" />
                Segera dimulai
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Download className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{stats.downloadBulanIni}</h3>
                  <p className="text-sm text-gray-600">Download Bulan Ini</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-yellow-600">
                <Activity className="h-4 w-4 mr-1" />
                Template aktif
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-gray-100">
                          <IconComponent className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Kegiatan Mendatang</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.status === 'Segera Dimulai' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(event.date).toLocaleDateString('id-ID')}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {event.participants} peserta
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Aksi Cepat</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/anggota/template"
                  className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Template Surat</h4>
                  <p className="text-xs text-gray-500 mt-1">Akses template dokumen</p>
                </a>

                <a
                  href="/anggota/data"
                  className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Data Anggota</h4>
                  <p className="text-xs text-gray-500 mt-1">Lihat data anggota MAPALA</p>
                </a>

                <a
                  href="/anggota/profile"
                  className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Profil Saya</h4>
                  <p className="text-xs text-gray-500 mt-1">Update informasi profil</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
