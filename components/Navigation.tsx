'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { logout } from '@/lib/auth';
import { LogOut, Home, TrendingUp, TrendingDown, Settings, FileText } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario, loading } = useAuth();

  function handleLogout() {
    logout();
    router.push('/auth/login');
  }

  const links = usuario ? [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/ingresos', label: 'Ingresos', icon: TrendingUp },
    { href: '/egresos', label: 'Egresos', icon: TrendingDown },
    { href: '/conceptos', label: 'Conceptos', icon: Settings },
    { href: '/reportes', label: 'Reportes', icon: FileText },
  ] : [];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-3 text-xl font-bold group font-montserrat">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                <span className="text-white text-lg">💰</span>
              </div>
              <span className="text-slate-900">Finanzas</span>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {links.map((link, i) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2 group ${
                      isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* User Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            {usuario && (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block px-4 py-2 rounded-lg bg-slate-100 border border-slate-200">
                  <p className="text-sm text-slate-700">
                    Hola, <span className="font-semibold text-blue-600">{usuario.nombre}</span>
                  </p>
                </div>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Salir</span>
                </motion.button>
              </div>
            )}
            {!usuario && !loading && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg hover:shadow-lg text-sm font-semibold transition-all duration-300 shadow-sm"
                >
                  Ingresar
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
