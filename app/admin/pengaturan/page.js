'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  Settings, 
  Save, 
  Database, 
  Mail, 
  Shield, 
  Users,
  Bell,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  Download
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminPengaturan() {
  const [settings, setSettings] = useState({
    siteName: 'MAPALA',
    siteDescription: 'Mahasiswa Pecinta Alam',
    adminEmail: 'admin@mapala.com',
    maxMembers: 100,
    registrationOpen: true,
    emailNotifications: true,
    autoApproval: false,
    backupInterval: 'weekly',
    sessionTimeout: 30,
    maintenanceMode: false
  });

  const [databaseStats, setDatabaseStats] = useState({
    totalUsers: 0,
    totalRegistrations: 0,
    totalTemplates: 0,
    totalDownloads: 0,
    lastBackup: null,
    databaseSize: '0 MB'
  });

  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminPasswordForm, setAdminPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    loadDatabaseStats();
  }, []);

  const loadSettings = () => {
    // Load from localStorage for demo
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setLoading(false);
  };

  const loadDatabaseStats = async () => {
    try {
      // Simulate loading database stats
      // In real app, this would call an API endpoint
      setDatabaseStats({
        totalUsers: 25,
        totalRegistrations: 45,
        totalTemplates: 8,
        totalDownloads: 156,
        lastBackup: new Date().toISOString(),
        databaseSize: '2.5 MB'
      });
    } catch (error) {
      console.error('Error loading database stats:', error);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('admin_settings', JSON.stringify(settings));
      toast.success('Pengaturan berhasil disimpan');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan');
    }
  };

  const handlePasswordChange = () => {
    if (!adminPasswordForm.currentPassword || !adminPasswordForm.newPassword) {
      toast.error('Semua field password harus diisi');
      return;
    }

    if (adminPasswordForm.newPassword !== adminPasswordForm.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }

    if (adminPasswordForm.newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    // Simulate password change
    toast.success('Password admin berhasil diubah');
    setAdminPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleBackupDatabase = () => {
    toast.info('Memulai backup database...');
    setTimeout(() => {
      toast.success('Backup database berhasil dibuat');
      setDatabaseStats(prev => ({
        ...prev,
        lastBackup: new Date().toISOString()
      }));
    }, 2000);
  };

  const handleClearCache = () => {
    toast.info('Membersihkan cache...');
    setTimeout(() => {
      toast.success('Cache berhasil dibersihkan');
    }, 1000);
  };

  const handleExportData = () => {
    toast.info('Memulai export data...');
    setTimeout(() => {
      toast.success('Data berhasil diexport');
    }, 2000);
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h1>
                <p className="text-gray-600">Kelola konfigurasi dan pengaturan aplikasi</p>
              </div>
              <button
                onClick={handleSaveSettings}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Simpan Pengaturan
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* General Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Site Configuration */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <Settings className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Konfigurasi Situs</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Situs</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleSettingChange('siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Situs</label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Admin</label>
                    <input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maksimal Anggota</label>
                    <input
                      type="number"
                      value={settings.maxMembers}
                      onChange={(e) => handleSettingChange('maxMembers', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Registration Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Pengaturan Pendaftaran</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Pendaftaran Terbuka</h4>
                      <p className="text-sm text-gray-500">Izinkan pendaftaran anggota baru</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('registrationOpen', !settings.registrationOpen)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.registrationOpen ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.registrationOpen ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Auto Approval</h4>
                      <p className="text-sm text-gray-500">Otomatis menyetujui pendaftaran baru</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('autoApproval', !settings.autoApproval)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.autoApproval ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.autoApproval ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <Bell className="h-5 w-5 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Pengaturan Notifikasi</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Kirim notifikasi melalui email</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.emailNotifications ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (menit)</label>
                    <input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Pengaturan Keamanan</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Mode Maintenance</h4>
                      <p className="text-sm text-gray-500">Aktifkan mode pemeliharaan situs</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('maintenanceMode', !settings.maintenanceMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Ubah Password Admin</h4>
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type={showAdminPassword ? "text" : "password"}
                          placeholder="Password saat ini"
                          value={adminPasswordForm.currentPassword}
                          onChange={(e) => setAdminPasswordForm(prev => ({...prev, currentPassword: e.target.value}))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type={showAdminPassword ? "text" : "password"}
                          placeholder="Password baru"
                          value={adminPasswordForm.newPassword}
                          onChange={(e) => setAdminPasswordForm(prev => ({...prev, newPassword: e.target.value}))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type={showAdminPassword ? "text" : "password"}
                          placeholder="Konfirmasi password baru"
                          value={adminPasswordForm.confirmPassword}
                          onChange={(e) => setAdminPasswordForm(prev => ({...prev, confirmPassword: e.target.value}))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showAdminPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={handlePasswordChange}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Ubah Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Database Statistics */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <Database className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Statistik Database</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Users:</span>
                    <span className="text-sm font-medium">{databaseStats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Registrasi:</span>
                    <span className="text-sm font-medium">{databaseStats.totalRegistrations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Template:</span>
                    <span className="text-sm font-medium">{databaseStats.totalTemplates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Download:</span>
                    <span className="text-sm font-medium">{databaseStats.totalDownloads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ukuran DB:</span>
                    <span className="text-sm font-medium">{databaseStats.databaseSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Backup:</span>
                    <span className="text-sm font-medium">
                      {databaseStats.lastBackup 
                        ? new Date(databaseStats.lastBackup).toLocaleDateString('id-ID')
                        : 'Belum pernah'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* System Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Sistem</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleBackupDatabase}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Database className="h-4 w-4" />
                    Backup Database
                  </button>
                  
                  <button
                    onClick={handleClearCache}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Clear Cache
                  </button>
                  
                  <button
                    onClick={handleExportData}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Data
                  </button>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interval Backup</label>
                    <select
                      value={settings.backupInterval}
                      onChange={(e) => handleSettingChange('backupInterval', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="daily">Harian</option>
                      <option value="weekly">Mingguan</option>
                      <option value="monthly">Bulanan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Sistem</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Server Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Maintenance:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      settings.maintenanceMode 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {settings.maintenanceMode ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
