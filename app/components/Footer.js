import { Mountain, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-green-400" />
              <span className="font-bold text-xl">MAPALA</span>
            </div>
            <p className="text-gray-300">
              Mahasiswa Pecinta Alam - Organisasi kampus yang berkomitmen untuk 
              mencintai dan melestarikan alam Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Menu Cepat</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-green-400 transition-colors">Beranda</a></li>
              <li><a href="/tentang" className="hover:text-green-400 transition-colors">Tentang Kami</a></li>
              <li><a href="/pendaftaran" className="hover:text-green-400 transition-colors">Pendaftaran</a></li>
              <li><a href="/template" className="hover:text-green-400 transition-colors">Template Surat</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Kontak</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>mapala@university.ac.id</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+62 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Kampus Universitas, Gedung Kemahasiswaan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Mahasiswa Pecinta Alam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
