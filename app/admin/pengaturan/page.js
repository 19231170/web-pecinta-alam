'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  Save, 
  Shield, 
  QrCode,
  Scan,
  Eye,
  EyeOff,
  Camera
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    adminEmail: '',
    siteName: ''
  });

  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminPasswordForm, setAdminPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showQrScanner, setShowQrScanner] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanningStatus, setScanningStatus] = useState('idle'); // 'idle', 'scanning', 'success', 'error'
  const [resetPassword, setResetPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [loading, setLoading] = useState(true);

  // Use NextAuth's useSession hook properly
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Debug session status
    console.log('Session status:', status);
    
    // Redirect if not authenticated or not admin
    if (status === 'unauthenticated') {
      console.log('Not authenticated, redirecting to login');
      router.push('/auth/login');
      return;
    }
    
    if (status === 'authenticated') {
      console.log('Session authenticated:', session);
      console.log('User role:', session.user?.role);
      
      // Check server-side session
      checkServerSession().then(debugData => {
        console.log('Server session check complete');
        
        // If user is not admin, redirect to unauthorized page
        if (session.user?.role !== 'admin') {
          console.log('Not admin, redirecting to unauthorized');
          router.push('/unauthorized');
          return;
        }
        
        // Load data only if user is authenticated and admin
        loadSettings();
      });
    }
  }, [status, session, router]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      console.log('Loading settings...');
      
      // Make sure we have an authenticated session before making the API call
      if (!session || !session.user) {
        console.log('No authenticated session, skipping API call');
        setLoading(false);
        return;
      }
      
      console.log('Making API call with role:', session.user.role);
      console.log('Full session object:', session);
      
      // Add cache-busting parameter to prevent cached responses
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/settings?_=${timestamp}`, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        credentials: 'include' // Important for cookies/session
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error('Settings response not OK:', response.status);
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Failed to load settings: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Settings data:', data);
      
      if (data.success) {
        setSettings({
          adminEmail: data.settings.adminEmail,
          siteName: data.settings.siteName
        });
      } else {
        throw new Error(data.message || 'Failed to load settings');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Gagal memuat pengaturan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      console.log('Saving settings...');
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/settings?_=${timestamp}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify(settings),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to save settings');
      }
      
      toast.success('Pengaturan berhasil disimpan');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan: ' + error.message);
    }
  };

  const handlePasswordChange = async () => {
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

    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/password?_=${timestamp}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        credentials: 'include', // Include credentials for authentication
        body: JSON.stringify({
          currentPassword: adminPasswordForm.currentPassword,
          newPassword: adminPasswordForm.newPassword,
        }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to change password');
      }

      toast.success('Password admin berhasil diubah');
      setAdminPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Gagal mengubah password');
    }
  };

  // Function to start QR scanner
  const startQrScanner = async () => {
    setShowQrScanner(true);
    setScanningStatus('scanning');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Start scanning QR code
        scanQrCode();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setScanningStatus('error');
      toast.error('Tidak dapat mengakses kamera');
    }
  };

  // Function to scan QR code from video stream
  const scanQrCode = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;
    
    const checkFrame = () => {
      if (scanningStatus !== 'scanning') return;
      
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Here you would implement QR code detection
        // For this example, we'll simulate finding a QR code after 3 seconds
        // In a real implementation, you would use a library like jsQR
        
        // Simulating QR code detection after 3 seconds
        setTimeout(() => {
          if (scanningStatus === 'scanning') {
            setQrCode('simulated-qr-code-123');
            setScanningStatus('success');
            stopQrScanner();
            
            // Use the QR code to reset password
            handleQrPasswordReset('simulated-qr-code-123');
          }
        }, 3000);
      }
      
      requestAnimationFrame(checkFrame);
    };
    
    checkFrame();
  };

  // Function to stop QR scanner
  const stopQrScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowQrScanner(false);
  };

  // Function to handle QR code password reset
  const handleQrPasswordReset = async (qrCode) => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/password/qr-reset?_=${timestamp}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        credentials: 'include',
        body: JSON.stringify({ qrCode }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to reset password');
      }

      // Show the new password to the admin
      if (data.newPassword) {
        setResetPassword(data.newPassword);
        setShowResetPassword(true);
      }

      toast.success('Password berhasil direset menggunakan QR Code');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Gagal mereset password');
    }
  };

  // Debug function to check session state on server
  const checkServerSession = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/debug/session-debug?_=${timestamp}`, {
        credentials: 'include'
      });
      const data = await response.json();
      console.log('Server session debug:', data);
      return data;
    } catch (error) {
      console.error('Error checking server session:', error);
      return null;
    }
  };

  // Handle loading and auth states
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  // If not authenticated, don't render anything (redirect is handled in useEffect)
  if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pengaturan Admin</h1>
              <p className="text-gray-600">Kelola akun dan keamanan admin</p>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Email Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Settings className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Email Admin</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Admin</label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="admin@example.com"
                />
                <p className="mt-1 text-sm text-gray-500">Email ini akan digunakan untuk pemberitahuan sistem dan reset password</p>
              </div>
            </div>
          </div>

          {/* Password Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Ubah Password Admin</h3>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Saat Ini</label>
                <input
                  type={showAdminPassword ? "text" : "password"}
                  placeholder="Masukkan password saat ini"
                  value={adminPasswordForm.currentPassword}
                  onChange={(e) => setAdminPasswordForm(prev => ({...prev, currentPassword: e.target.value}))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                <input
                  type={showAdminPassword ? "text" : "password"}
                  placeholder="Masukkan password baru"
                  value={adminPasswordForm.newPassword}
                  onChange={(e) => setAdminPasswordForm(prev => ({...prev, newPassword: e.target.value}))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
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
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Ubah Password
              </button>
            </div>
          </div>

          {/* QR Code Password Reset */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <QrCode className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Reset Password dengan QR Code</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Gunakan QR Code untuk melakukan reset password admin jika lupa password. 
                Scan QR Code yang sudah disediakan sebelumnya.
              </p>
              
              <button
                onClick={startQrScanner}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Scan className="h-4 w-4" />
                Scan QR Code
              </button>
              
              {showQrScanner && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-lg font-semibold text-center mb-4">Scan QR Code</h3>
                    
                    <div className="relative w-full aspect-square bg-black mb-4 overflow-hidden rounded-lg">
                      <video 
                        ref={videoRef} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <canvas 
                        ref={canvasRef} 
                        className="absolute inset-0 w-full h-full"
                        style={{ display: 'none' }}
                      />
                      
                      {/* Scanning overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {scanningStatus === 'scanning' && (
                          <div className="border-2 border-green-500 w-3/4 h-3/4 animate-pulse">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500"></div>
                          </div>
                        )}
                        
                        {scanningStatus === 'success' && (
                          <div className="text-green-500 text-center">
                            <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="mt-2 font-semibold">QR Code Terdeteksi!</p>
                          </div>
                        )}
                        
                        {scanningStatus === 'error' && (
                          <div className="text-red-500 text-center">
                            <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <p className="mt-2 font-semibold">Gagal mengakses kamera</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={stopQrScanner}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Show generated password modal */}
              {showResetPassword && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-lg font-semibold text-center mb-4">Password Baru</h3>
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                      <p className="text-center font-mono text-lg break-all">{resetPassword}</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Harap catat password baru ini dan simpan di tempat yang aman. 
                      Password ini tidak akan ditampilkan kembali.
                    </p>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowResetPassword(false)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mengerti
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
