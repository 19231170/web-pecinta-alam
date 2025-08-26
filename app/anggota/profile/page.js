'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { User, Mail, Phone, MapPin, Book, Calendar, Save, Edit, Camera } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AnggotaProfile() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (session?.user?.email) {
      // Load profile data from localStorage
      const savedProfile = localStorage.getItem(`profile_${session.user.email}`);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setProfileData(profile);
        setFormData(profile);
      } else {
        // Default profile data based on session
        const defaultProfile = {
          nama: session.user.name || '',
          email: session.user.email,
          nim: '',
          phone: '',
          jurusan: '',
          angkatan: '',
          alamat: '',
          tanggalLahir: '',
          jenisKelamin: '',
          posisi: 'Anggota',
          tanggalBergabung: new Date().toISOString().split('T')[0],
          skillsKeahlian: '',
          motivasi: '',
          pengalamanSebelumnya: '',
          hobiMinat: '',
          emergencyContact: '',
          emergencyPhone: '',
          status: 'aktif'
        };
        setProfileData(defaultProfile);
        setFormData(defaultProfile);
      }
    }
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem(`profile_${session.user.email}`, JSON.stringify(formData));
    setProfileData(formData);
    setIsEditing(false);
    toast.success('Profil berhasil diperbarui!');
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  const calculateMembershipDuration = () => {
    if (!profileData.tanggalBergabung) return '0 hari';
    
    const joinDate = new Date(profileData.tanggalBergabung);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} hari`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} bulan`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} tahun ${remainingMonths} bulan`;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['anggota']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
                <p className="text-gray-600">Kelola informasi profil dan preferensi akun Anda</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isEditing
                    ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Edit className="h-4 w-4" />
                {isEditing ? 'Batal Edit' : 'Edit Profil'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Profile Photo Section */}
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-green-600" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{profileData.nama || 'Nama Lengkap'}</h2>
                <p className="text-gray-600">{profileData.posisi || 'Anggota'}</p>
                <p className="text-sm text-gray-500">Bergabung {calculateMembershipDuration()}</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Informasi Pribadi</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.nama || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NIM</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nim"
                      value={formData.nim || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.nim || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{profileData.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">No. Telepon</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{profileData.phone || '-'}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jurusan</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="jurusan"
                      value={formData.jurusan || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Book className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{profileData.jurusan || '-'}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Angkatan</label>
                  {isEditing ? (
                    <select
                      name="angkatan"
                      value={formData.angkatan || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Pilih Angkatan</option>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-900">{profileData.angkatan || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="tanggalLahir"
                      value={formData.tanggalLahir || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">
                        {profileData.tanggalLahir 
                          ? new Date(profileData.tanggalLahir).toLocaleDateString('id-ID')
                          : '-'
                        }
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                  {isEditing ? (
                    <select
                      name="jenisKelamin"
                      value={formData.jenisKelamin || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profileData.jenisKelamin || '-'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                  {isEditing ? (
                    <textarea
                      name="alamat"
                      value={formData.alamat || ''}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-gray-900">{profileData.alamat || '-'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Organizational Information */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Informasi Organisasi</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Posisi</label>
                  <p className="text-gray-900">{profileData.posisi || 'Anggota'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Bergabung</label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">
                      {profileData.tanggalBergabung 
                        ? new Date(profileData.tanggalBergabung).toLocaleDateString('id-ID')
                        : '-'
                      }
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills/Keahlian</label>
                  {isEditing ? (
                    <textarea
                      name="skillsKeahlian"
                      value={formData.skillsKeahlian || ''}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Contoh: Panjat tebing, Navigasi, Fotografi alam, dll."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.skillsKeahlian || '-'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motivasi</label>
                  {isEditing ? (
                    <textarea
                      name="motivasi"
                      value={formData.motivasi || ''}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Ceritakan motivasi Anda bergabung dengan MAPALA..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.motivasi || '-'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Informasi Tambahan</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pengalaman Sebelumnya</label>
                  {isEditing ? (
                    <textarea
                      name="pengalamanSebelumnya"
                      value={formData.pengalamanSebelumnya || ''}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Ceritakan pengalaman petualangan atau organisasi sebelumnya..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.pengalamanSebelumnya || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hobi & Minat</label>
                  {isEditing ? (
                    <textarea
                      name="hobiMinat"
                      value={formData.hobiMinat || ''}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Contoh: Fotografi, traveling, olahraga, musik, dll."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.hobiMinat || '-'}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kontak Darurat</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact || ''}
                        onChange={handleInputChange}
                        placeholder="Nama lengkap"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.emergencyContact || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">No. Kontak Darurat</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={formData.emergencyPhone || ''}
                        onChange={handleInputChange}
                        placeholder="Nomor telepon"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.emergencyPhone || '-'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save/Cancel Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Simpan Perubahan
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
