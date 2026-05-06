'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { logout } from '@/lib/auth';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario, loading } = useAuth();

  function handleLogout() {
    logout();
    router.push('/auth/login');
  }

  const links = usuario ? [
    { href: '/', label: 'Dashboard' },
    { href: '/ingresos', label: 'Ingresos' },
    { href: '/egresos', label: 'Egresos' },
    { href: '/conceptos', label: 'Conceptos' },
    { href: '/reportes', label: 'Reportes' },
  ] : [];

  return (
    <nav className="bg-[#4a6fa5] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            💰 Finanzas
          </Link>
          <div className="flex items-center space-x-4">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  pathname === link.href
                    ? 'bg-[#2d4563] text-white'
                    : 'text-[#d4e4f7] hover:bg-[#3d5a7f]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {usuario && (
              <div className="flex items-center space-x-3 border-l border-[#d4e4f7] pl-4">
                <span className="text-sm text-[#d4e4f7]">{usuario.nombre}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-[#d4e4f7] hover:bg-[#3d5a7f] rounded-md transition"
                >
                  Logout
                </button>
              </div>
            )}
            {!usuario && !loading && (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-white text-[#4a6fa5] rounded-lg hover:bg-gray-100 text-sm font-semibold"
              >
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
