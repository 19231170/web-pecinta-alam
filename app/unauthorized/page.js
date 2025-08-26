import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <Shield className="h-16 w-16 text-red-600" />
          </div>
        </div>
        
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Akses Ditolak
        </h1>
        
        <p className="mt-4 text-gray-600">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        
        <div className="mt-8 space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Link>
          
          <div className="text-sm text-gray-500">
            <Link href="/auth/login" className="text-green-600 hover:text-green-500">
              Login dengan akun yang sesuai
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
