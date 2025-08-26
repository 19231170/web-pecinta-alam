'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Mountain, User, LogOut, Settings } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session } = useSession();

  const getMenuItems = () => {
    const publicItems = [
      { href: '/', label: 'Beranda' },
      { href: '/tentang', label: 'Tentang Kami' },
    ];

    if (!session) {
      return [
        ...publicItems,
        { href: '/pendaftaran', label: 'Pendaftaran' },
        { href: '/auth/login', label: 'Login' },
      ];
    }

    const roleBasedItems = {
      admin: [
        ...publicItems,
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/anggota', label: 'Kelola Anggota' },
        { href: '/admin/pendaftaran', label: 'Kelola Pendaftaran' },
        { href: '/admin/template', label: 'Kelola Template' },
      ],
      anggota: [
        ...publicItems,
        { href: '/anggota/dashboard', label: 'Dashboard' },
        { href: '/anggota/template', label: 'Template Surat' },
        { href: '/anggota/data', label: 'Data Anggota' },
      ]
    };

    return roleBasedItems[session.user.role] || publicItems;
  };

  const menuItems = getMenuItems();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Mountain className="h-8 w-8" />
              <span className="font-bold text-xl">MAPALA</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.slice(0, -1).map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="hover:text-green-200 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:text-green-200 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>{session.user.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{session.user.name}</div>
                      <div className="text-gray-500">{session.user.email}</div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-1 inline-block">
                        {session.user.role === 'admin' ? 'Administrator' : 'Anggota'}
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profil
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-green-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block px-3 py-2 hover:bg-green-700 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {session && (
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 hover:bg-green-700 rounded-md"
                >
                  Logout ({session.user.name})
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
