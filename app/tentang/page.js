import { Mountain, Target, Eye, Users, Award, Heart } from 'lucide-react';

export default function TentangPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Mountain className="h-16 w-16 mx-auto mb-6 text-green-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tentang MAPALA
            </h1>
            <p className="text-xl md:text-2xl text-green-100">
              Mengenal lebih dekat Mahasiswa Pecinta Alam kampus
            </p>
          </div>
        </div>
      </section>

      {/* Sejarah */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Sejarah Organisasi
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Mahasiswa Pecinta Alam (MAPALA) didirikan pada tahun 2014 oleh sekelompok 
                  mahasiswa yang memiliki passion terhadap alam dan lingkungan. Berawal dari 
                  kegiatan hiking sederhana, organisasi ini berkembang menjadi salah satu 
                  unit kegiatan mahasiswa yang paling aktif di kampus.
                </p>
                <p>
                  Selama lebih dari 10 tahun, MAPALA telah mengorganisir ratusan kegiatan 
                  mulai dari pendakian gunung, konservasi lingkungan, hingga program 
                  pengabdian masyarakat di daerah terpencil.
                </p>
                <p>
                  Kami bangga telah melahirkan alumni-alumni yang menjadi pemimpin di 
                  berbagai bidang, dengan tetap mempertahankan jiwa petualang dan 
                  kepedulian terhadap alam.
                </p>
              </div>
            </div>
            <div className="bg-green-100 p-8 rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-800 mb-2">2014</div>
                <div className="text-gray-600 mb-6">Tahun Berdiri</div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">150+</div>
                    <div className="text-sm text-gray-600">Alumni</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">50+</div>
                    <div className="text-sm text-gray-600">Anggota Aktif</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">100+</div>
                    <div className="text-sm text-gray-600">Kegiatan</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">25+</div>
                    <div className="text-sm text-gray-600">Gunung</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Visi */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-6">
                <Eye className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Visi</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Menjadi organisasi mahasiswa pecinta alam yang unggul dalam 
                membentuk karakter mahasiswa yang peduli lingkungan, berjiwa 
                petualang, dan berkontribusi positif bagi masyarakat dan bangsa.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Misi</h3>
              </div>
              <ul className="text-gray-700 space-y-3">
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                  Mengembangkan potensi mahasiswa melalui kegiatan alam terbuka
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                  Meningkatkan kesadaran lingkungan di kalangan mahasiswa
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                  Melakukan kegiatan konservasi dan pelestarian alam
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                  Membangun jaringan dan kemitraan dengan organisasi sejenis
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai-nilai */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nilai-Nilai Organisasi
            </h2>
            <p className="text-xl text-gray-600">
              Prinsip-prinsip yang menjadi landasan dalam setiap kegiatan kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cinta Alam</h3>
              <p className="text-gray-600">
                Memiliki kecintaan mendalam terhadap alam dan berkomitmen 
                untuk melestarikannya bagi generasi mendatang.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kekeluargaan</h3>
              <p className="text-gray-600">
                Membangun hubungan yang erat antar anggota dengan semangat 
                gotong royong dan saling mendukung.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prestasi</h3>
              <p className="text-gray-600">
                Selalu berusaha memberikan yang terbaik dalam setiap kegiatan 
                dan mencapai prestasi yang membanggakan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kegiatan */}
      <section className="py-16 bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Kegiatan Rutin Kami
            </h2>
            <p className="text-xl text-green-100">
              Berbagai program yang kami selenggarakan sepanjang tahun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-green-700 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">Pendakian Gunung</h4>
              <p className="text-green-100 text-sm">
                Eksplorasi gunung-gunung di Indonesia dengan program pendakian rutin setiap bulan.
              </p>
            </div>

            <div className="bg-green-700 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">Pelatihan SAR</h4>
              <p className="text-green-100 text-sm">
                Pelatihan Search and Rescue untuk mengembangkan kemampuan pertolongan darurat.
              </p>
            </div>

            <div className="bg-green-700 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">Konservasi Alam</h4>
              <p className="text-green-100 text-sm">
                Program pelestarian lingkungan seperti penanaman pohon dan pembersihan sungai.
              </p>
            </div>

            <div className="bg-green-700 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">Pengabdian Masyarakat</h4>
              <p className="text-green-100 text-sm">
                Kegiatan sosial untuk membantu masyarakat di daerah terpencil dan pegunungan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Tertarik Bergabung?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Jadilah bagian dari keluarga besar MAPALA dan rasakan pengalaman 
            yang akan mengubah cara pandang Anda terhadap alam dan kehidupan.
          </p>
          <a
            href="/pendaftaran"
            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
          >
            Daftar Sekarang
          </a>
        </div>
      </section>
    </div>
  );
}
