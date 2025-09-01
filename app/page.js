import Image from "next/image";
import Link from "next/link";
import { Mountain, Users, FileText, Calendar, Award, Heart } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Mountain className="h-20 w-20 mx-auto mb-6 text-green-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Mahasiswa Pecinta Alam
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Bergabunglah dengan komunitas pecinta alam dan jelajahi keindahan Indonesia
            </p>
            <div className="space-x-4">
              <Link
                href="/pendaftaran"
                className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Daftar Sekarang
              </Link>
              <Link
                href="/tentang"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-colors"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mengapa Bergabung dengan MAPALA?
            </h2>
            <p className="text-xl text-gray-600">
              Temukan pengalaman tak terlupakan dan kembangkan diri Anda bersama kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Mountain className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Petualangan Alam</h3>
              <p className="text-gray-600">
                Jelajahi gunung, hutan, dan keindahan alam Indonesia dengan kegiatan hiking, camping, dan eksplorasi.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Komunitas Solid</h3>
              <p className="text-gray-600">
                Bertemu dengan teman-teman seperjuangan yang memiliki passion sama terhadap alam dan lingkungan.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pengembangan Diri</h3>
              <p className="text-gray-600">
                Asah kemampuan leadership, survival, dan soft skills melalui berbagai pelatihan dan kegiatan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Layanan Kami
            </h2>
            <p className="text-xl text-gray-600">
              Berbagai layanan untuk mendukung kegiatan organisasi dan anggota
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-50 p-8 rounded-lg">
              <FileText className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Template Surat</h3>
              <p className="text-gray-700 mb-4">
                Akses berbagai template surat untuk keperluan administratif organisasi, 
                mulai dari surat izin kegiatan hingga surat rekomendasi.
              </p>
              <Link
                href="/template"
                className="text-green-600 font-semibold hover:text-green-700"
              >
                Lihat Template →
              </Link>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Pendaftaran Anggota</h3>
              <p className="text-gray-700 mb-4">
                Sistem pendaftaran online yang mudah dan terintegrasi untuk 
                calon anggota baru MAPALA.
              </p>
              <Link
                href="/pendaftaran"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Daftar Sekarang →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-green-200">Anggota Aktif</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-green-200">Gunung Didaki</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-green-200">Kegiatan per Tahun</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-green-200">Tahun Berdiri</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai Petualangan?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Bergabunglah dengan MAPALA dan jadilah bagian dari keluarga besar pecinta alam. 
            Dapatkan pengalaman yang akan mengubah hidup Anda!
          </p>
          <Link
            href="/pendaftaran"
            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
          >
            Bergabung Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
