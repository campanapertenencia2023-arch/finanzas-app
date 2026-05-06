'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/ingresos', label: 'Ingresos' },
    { href: '/egresos', label: 'Egresos' },
    { href: '/conceptos', label: 'Conceptos' },
    { href: '/reportes', label: 'Reportes' },
  ];

  return (
    <nav className="bg-[#4a6fa5] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            💰 Finanzas
          </Link>
          <div className="flex space-x-4">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
