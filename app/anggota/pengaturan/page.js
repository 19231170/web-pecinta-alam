'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  AlertTriangle,
  X,
  Shield,
  User
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function AnggotaPengaturan() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  
  // State untuk form email
  const [emailForm, setEmailForm] = useState({
    currentPassword: '',
    newEmail: '',
    confirmEmail: '',
  });
  
  // State untuk form password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // State untuk toggle show/hide password
  const [showPasswords, setShowPasswords] = useState({
    emailCurrentPassword: false,
    passwordCurrentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (session?.user?.email) {
      loadUserData();
    }
  }, [session]);

  const loadUserData = async () => {
    try {
      const response = await fetch(`/api/user/profile?email=${session.user.email}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setEmailForm(prev => ({
          ...prev,
          newEmail: data.email,
          confirmEmail: data.email,
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    
    if (!emailForm.currentPassword) {
      toast.error('Password saat ini diperlukan');
      return;
    }
    
    if (emailForm.newEmail !== emailForm.confirmEmail) {
      toast.error('Email baru dan konfirmasi email tidak cocok');
      return;
    }
    
    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.newEmail)) {
      toast.error('Format email tidak valid');
      return;
    }
    
    // Jika email sama dengan yang sekarang, tidak perlu update
    if (emailForm.newEmail === userData.email) {
      toast.info('Email sama dengan email saat ini');
      return;
    }
    
    try {
      const response = await fetch('/api/user/email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentEmail: userData.email,
          newEmail: emailForm.newEmail,
          password: emailForm.currentPassword,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Email berhasil diperbarui');
        // Reset form
        setEmailForm({
          currentPassword: '',
          newEmail: data.email,
          confirmEmail: data.email,
        });
        // Update userData
        setUserData(prev => ({
          ...prev,
          email: data.email,
        }));
      } else {
        toast.error(data.message || 'Gagal memperbarui email');
      }
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('Terjadi kesalahan saat memperbarui email');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword) {
      toast.error('Password saat ini diperlukan');
      return;
    }
    
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Password baru dan konfirmasi password diperlukan');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Password baru dan konfirmasi password tidak cocok');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return;
    }
    
    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Password berhasil diperbarui');
        // Reset form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(data.message || 'Gagal memperbarui password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Terjadi kesalahan saat memperbarui password');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['anggota', 'admin']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['anggota', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h1>
                <p className="text-gray-600">Kelola email dan password akun Anda</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Update Email */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Mail className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Ubah Email</h3>
              </div>
              
              <form onSubmit={handleEmailChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Saat Ini</label>
                  <div className="bg-gray-50 px-3 py-2 border border-gray-300 rounded-lg text-gray-600">
                    {userData?.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Saat Ini</label>
                  <div className="relative">
                    <input
                      type={showPasswords.emailCurrentPassword ? "text" : "password"}
                      value={emailForm.currentPassword}
                      onChange={(e) => setEmailForm({...emailForm, currentPassword: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan password Anda"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('emailCurrentPassword')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.emailCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Baru</label>
                  <input
                    type="email"
                    value={emailForm.newEmail}
                    onChange={(e) => setEmailForm({...emailForm, newEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan email baru"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Email Baru</label>
                  <input
                    type="email"
                    value={emailForm.confirmEmail}
                    onChange={(e) => setEmailForm({...emailForm, confirmEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Konfirmasi email baru"
                    required
                  />
                </div>
                
                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p>Mengubah email akan mengharuskan Anda login kembali dengan email baru.</p>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Simpan Email Baru
                </button>
              </form>
            </div>
            
            {/* Update Password */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Lock className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Ubah Password</h3>
              </div>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Saat Ini</label>
                  <div className="relative">
                    <input
                      type={showPasswords.passwordCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Masukkan password saat ini"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('passwordCurrentPassword')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.passwordCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                  <div className="relative">
                    <input
                      type={showPasswords.newPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Masukkan password baru"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.newPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Konfirmasi password baru"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.confirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Tips for strong password */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                  <p className="font-medium mb-2">Tips Password Kuat:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Minimal 8 karakter</li>
                    <li>Kombinasi huruf besar dan kecil</li>
                    <li>Tambahkan angka dan simbol khusus</li>
                    <li>Hindari informasi pribadi yang mudah ditebak</li>
                  </ul>
                </div>
                
                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p>Mengubah password akan mengharuskan Anda login kembali dengan password baru.</p>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Simpan Password Baru
                </button>
              </form>
            </div>
          </div>
          
          {/* Account Security Info */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Informasi Keamanan Akun</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Akun</p>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <p className="text-gray-900">{userData?.name || '-'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Role</p>
                <div className="flex items-center">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    {userData?.role?.toUpperCase() || '-'}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Terakhir Update</p>
                <p className="text-gray-900">{userData?.updatedAt ? new Date(userData.updatedAt).toLocaleDateString('id-ID') : '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                <p className="text-gray-900">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    userData?.status === 'AKTIF' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {userData?.status || 'TIDAK AKTIF'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 flex items-start">
                <Shield className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                <p>Untuk keamanan akun Anda, pastikan untuk menggunakan password yang kuat dan tidak membagikan informasi login Anda kepada siapapun. Jika Anda mencurigai adanya aktivitas tidak sah pada akun Anda, segera hubungi administrator.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
