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
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-lg border-b border-slate-700/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-3 text-xl font-bold group">
              <div className="p-2 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300">
                <span className="text-slate-900 text-lg">💰</span>
              </div>
              <span className="text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text">
                Finanzas
              </span>
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
                    className="relative px-3 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                <div className="hidden sm:block px-4 py-2 rounded-lg bg-slate-700/30 border border-slate-600/50">
                  <p className="text-sm text-slate-300">
                    Hola, <span className="font-semibold text-emerald-400">{usuario.nombre}</span>
                  </p>
                </div>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-all duration-300"
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
                  className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 text-sm font-semibold transition-all duration-300"
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
