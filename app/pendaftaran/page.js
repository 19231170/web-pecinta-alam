'use client';

import { useState } from 'react';
import { UserPlus, Mail, Phone, User, Calendar, MapPin, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

export default function PendaftaranPage() {
  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
    email: '',
    telefon: '',
    tanggalLahir: '',
    jenisKelamin: '',
    fakultas: '',
    jurusan: '',
    semester: '',
    alamat: '',
    motivasi: '',
    pengalamanAlam: '',
    keahlianKhusus: '',
    kontakDarurat: '',
    persetujuan: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validasi
    if (!formData.nama || !formData.nim || !formData.email || !formData.telefon) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      setIsSubmitting(false);
      return;
    }

    if (!formData.persetujuan) {
      toast.error('Anda harus menyetujui syarat dan ketentuan');
      setIsSubmitting(false);
      return;
    }

    // Simulasi pengiriman data
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simpan ke localStorage untuk simulasi database
      const existingData = JSON.parse(localStorage.getItem('pendaftaran') || '[]');
      const newData = {
        ...formData,
        id: Date.now(),
        tanggalDaftar: new Date().toISOString(),
        status: 'Menunggu Verifikasi'
      };
      existingData.push(newData);
      localStorage.setItem('pendaftaran', JSON.stringify(existingData));

      toast.success('Pendaftaran berhasil dikirim! Kami akan menghubungi Anda segera.');
      
      // Reset form
      setFormData({
        nama: '',
        nim: '',
        email: '',
        telefon: '',
        tanggalLahir: '',
        jenisKelamin: '',
        fakultas: '',
        jurusan: '',
        semester: '',
        alamat: '',
        motivasi: '',
        pengalamanAlam: '',
        keahlianKhusus: '',
        kontakDarurat: '',
        persetujuan: false
      });
      
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <UserPlus className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Daftar Anggota MAPALA
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Bergabunglah dengan komunitas pecinta alam kampus
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Formulir Pendaftaran
              </h2>
              <p className="text-gray-600">
                Silakan lengkapi data diri Anda dengan benar. Semua field yang bertanda (*) wajib diisi.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Data Pribadi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIM *
                  </label>
                  <input
                    type="text"
                    name="nim"
                    value={formData.nim}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan NIM"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="contoh@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telefon *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="08xxxxxxxxxx"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Lahir
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="tanggalLahir"
                      value={formData.tanggalLahir}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              {/* Data Akademik */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Akademik</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fakultas
                    </label>
                    <input
                      type="text"
                      name="fakultas"
                      value={formData.fakultas}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: Teknik"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jurusan
                    </label>
                    <input
                      type="text"
                      name="jurusan"
                      value={formData.jurusan}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: Informatika"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih semester</option>
                      {[1,2,3,4,5,6,7,8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Lengkap
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    rows={3}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>
              </div>

              {/* Pertanyaan Tambahan */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Tambahan</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motivasi bergabung dengan MAPALA
                    </label>
                    <textarea
                      name="motivasi"
                      value={formData.motivasi}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ceritakan motivasi Anda bergabung dengan MAPALA..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pengalaman kegiatan alam (jika ada)
                    </label>
                    <textarea
                      name="pengalamanAlam"
                      value={formData.pengalamanAlam}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ceritakan pengalaman Anda di alam bebas..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keahlian khusus (jika ada)
                    </label>
                    <input
                      type="text"
                      name="keahlianKhusus"
                      value={formData.keahlianKhusus}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: Fotografi, Panjat tebing, P3K, dll"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kontak darurat (Nama & No. HP)
                    </label>
                    <input
                      type="text"
                      name="kontakDarurat"
                      value={formData.kontakDarurat}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: Ibu Siti - 08123456789"
                    />
                  </div>
                </div>
              </div>

              {/* Persetujuan */}
              <div className="border-t pt-6">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="persetujuan"
                    checked={formData.persetujuan}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label className="ml-3 text-sm text-gray-700">
                    Saya menyetujui <a href="#" className="text-blue-600 hover:underline">syarat dan ketentuan</a> yang berlaku dan bersedia mengikuti seluruh kegiatan MAPALA dengan penuh tanggung jawab. Data yang saya berikan adalah benar dan dapat dipertanggungjawabkan.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Proses Pendaftaran
            </h2>
            <p className="text-xl text-gray-600">
              Ikuti langkah-langkah berikut untuk menjadi anggota MAPALA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Daftar Online</h3>
              <p className="text-gray-600 text-sm">Lengkapi formulir pendaftaran online dengan data yang benar</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Verifikasi</h3>
              <p className="text-gray-600 text-sm">Tim kami akan memverifikasi data dan menghubungi Anda</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Wawancara</h3>
              <p className="text-gray-600 text-sm">Mengikuti sesi wawancara singkat dengan pengurus</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Pengumuman</h3>
              <p className="text-gray-600 text-sm">Pengumuman hasil seleksi dan orientasi anggota baru</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
