'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Award,
  Edit,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function AnggotaProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nim: '',
    phone: '',
    jurusan: '',
    angkatan: '',
    alamat: '',
    tanggalLahir: '',
    jenisKelamin: '',
    posisi: '',
    skillsKeahlian: '',
    motivasi: '',
    pengalamanSebelumnya: '',
    hobiMinat: '',
    emergencyContact: '',
    emergencyPhone: '',
    password: ''
  });

  useEffect(() => {
    if (session?.user?.email) {
      loadProfile();
    }
  }, [session]);

  const loadProfile = async () => {
    try {
      const response = await fetch(`/api/user/profile?email=${session.user.email}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          nim: data.nim || '',
          phone: data.phone || '',
          jurusan: data.jurusan || '',
          angkatan: data.angkatan || '',
          alamat: data.alamat || '',
          tanggalLahir: data.tanggalLahir ? data.tanggalLahir.split('T')[0] : '',
          jenisKelamin: data.jenisKelamin || '',
          posisi: data.posisi || '',
          skillsKeahlian: data.skillsKeahlian || '',
          motivasi: data.motivasi || '',
          pengalamanSebelumnya: data.pengalamanSebelumnya || '',
          hobiMinat: data.hobiMinat || '',
          emergencyContact: data.emergencyContact || '',
          emergencyPhone: data.emergencyPhone || '',
          password: ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password; // Don't send empty password
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success('Profil berhasil diperbarui');
        setEditing(false);
        loadProfile();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Terjadi kesalahan saat memperbarui profil');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      nim: profile?.nim || '',
      phone: profile?.phone || '',
      jurusan: profile?.jurusan || '',
      angkatan: profile?.angkatan || '',
      alamat: profile?.alamat || '',
      tanggalLahir: profile?.tanggalLahir ? profile.tanggalLahir.split('T')[0] : '',
      jenisKelamin: profile?.jenisKelamin || '',
      posisi: profile?.posisi || '',
      skillsKeahlian: profile?.skillsKeahlian || '',
      motivasi: profile?.motivasi || '',
      pengalamanSebelumnya: profile?.pengalamanSebelumnya || '',
      hobiMinat: profile?.hobiMinat || '',
      emergencyContact: profile?.emergencyContact || '',
      emergencyPhone: profile?.emergencyPhone || '',
      password: ''
    });
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
                <p className="text-gray-600">Kelola informasi profil Anda</p>
              </div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Simpan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informasi Dasar */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Nama Lengkap
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.name || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email
                  </label>
                  <p className="text-gray-900">{profile?.email || '-'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="inline h-4 w-4 mr-1" />
                    NIM
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.nim}
                      onChange={(e) => setFormData({...formData, nim: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.nim || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Telepon
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.phone || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jurusan</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.jurusan}
                      onChange={(e) => setFormData({...formData, jurusan: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.jurusan || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Angkatan</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.angkatan}
                      onChange={(e) => setFormData({...formData, angkatan: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.angkatan || '-'}</p>
                  )}
                </div>
              </div>

              {/* Informasi Lanjutan */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Lanjutan</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Alamat
                  </label>
                  {editing ? (
                    <textarea
                      value={formData.alamat}
                      onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.alamat || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Tanggal Lahir
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      value={formData.tanggalLahir}
                      onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.tanggalLahir ? new Date(profile.tanggalLahir).toLocaleDateString('id-ID') : '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                  {editing ? (
                    <select
                      value={formData.jenisKelamin}
                      onChange={(e) => setFormData({...formData, jenisKelamin: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profile?.jenisKelamin || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Award className="inline h-4 w-4 mr-1" />
                    Posisi
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.posisi}
                      onChange={(e) => setFormData({...formData, posisi: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.posisi || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <p className="text-gray-900">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      profile?.status === 'AKTIF' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {profile?.status || 'TIDAK AKTIF'}
                    </span>
                  </p>
                </div>

                {editing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Baru (kosongkan jika tidak ingin mengubah)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan password baru"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Tambahan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills/Keahlian</label>
                  {editing ? (
                    <textarea
                      value={formData.skillsKeahlian}
                      onChange={(e) => setFormData({...formData, skillsKeahlian: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Sebutkan keahlian yang Anda miliki"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.skillsKeahlian || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hobi & Minat</label>
                  {editing ? (
                    <textarea
                      value={formData.hobiMinat}
                      onChange={(e) => setFormData({...formData, hobiMinat: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Sebutkan hobi dan minat Anda"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.hobiMinat || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kontak Darurat</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nama kontak darurat"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.emergencyContact || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telepon Darurat</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nomor telepon darurat"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.emergencyPhone || '-'}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Motivasi Bergabung</label>
                {editing ? (
                  <textarea
                    value={formData.motivasi}
                    onChange={(e) => setFormData({...formData, motivasi: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ceritakan motivasi Anda bergabung dengan MAPALA"
                  />
                ) : (
                  <p className="text-gray-900">{profile?.motivasi || '-'}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pengalaman Sebelumnya</label>
                {editing ? (
                  <textarea
                    value={formData.pengalamanSebelumnya}
                    onChange={(e) => setFormData({...formData, pengalamanSebelumnya: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ceritakan pengalaman organisasi atau kegiatan alam sebelumnya"
                  />
                ) : (
                  <p className="text-gray-900">{profile?.pengalamanSebelumnya || '-'}</p>
                )}
              </div>
            </div>

            {/* Member Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Keanggotaan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <p className="text-gray-900">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      {profile?.role?.toUpperCase() || '-'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Bergabung</label>
                  <p className="text-gray-900">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('id-ID') : '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terakhir Update</label>
                  <p className="text-gray-900">{profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('id-ID') : '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
