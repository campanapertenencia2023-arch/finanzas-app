'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { formatearMoneda, obtenerAñoActual } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Plus, Eye, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { usuario, loading: authLoading } = useAuth();
  const [conceptos, setConceptos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [año, setAño] = useState(obtenerAñoActual());

  useEffect(() => {
    async function cargarDatos() {
      if (!usuario) return;
      try {
        const response = await fetch(`/api/resumen?usuario=${usuario.id}&año=${año}`);
        if (!response.ok) throw new Error('Error al cargar datos');
        const resumen = await response.json();
        setConceptos(resumen);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && usuario) {
      cargarDatos();
    } else if (!authLoading && !usuario) {
      setLoading(false);
    }
  }, [año, usuario, authLoading]);

  if (!usuario && !authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-12 text-center max-w-md">
          <h2 className="text-3xl font-bold text-emerald-400 mb-4">Acceso Requerido</h2>
          <p className="text-slate-300 mb-8">Debes iniciar sesión para acceder al dashboard.</p>
          <Link href="/auth/login" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg">
            Ir a Login
          </Link>
        </div>
      </div>
    );
  }

  const totalIngresos = conceptos.reduce((sum, c) => sum + c.ingresos, 0);
  const totalEgresos = conceptos.reduce((sum, c) => sum + c.egresos, 0);
  const balance = totalIngresos - totalEgresos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">💰 Dashboard Financiero</h1>
          <p className="text-slate-400 text-lg">Bienvenido, {usuario?.nombre || 'Usuario'}</p>
        </div>

        {/* PERIODO SELECTOR */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-semibold text-lg">Período</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAño(año - 1)}
                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-4xl font-bold text-cyan-400 w-24 text-center">{año}</span>
              <button
                onClick={() => setAño(año + 1)}
                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* ACCIONES RAPIDAS - BOTONES GRANDES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/ingresos" className="bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-6 px-8 rounded-xl flex items-center justify-center gap-3 text-xl transition-all transform hover:scale-105">
            <Plus className="w-6 h-6" />
            Registrar Ingreso
          </Link>
          <Link href="/egresos" className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-6 px-8 rounded-xl flex items-center justify-center gap-3 text-xl transition-all transform hover:scale-105">
            <Plus className="w-6 h-6" />
            Registrar Egreso
          </Link>
          <Link href="/reportes" className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-6 px-8 rounded-xl flex items-center justify-center gap-3 text-xl transition-all transform hover:scale-105">
            <Eye className="w-6 h-6" />
            Ver Reportes
          </Link>
        </div>

        {/* KPI CARDS - GRANDES Y CLAROS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* INGRESOS */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-900/10 border-2 border-emerald-500/50 rounded-xl p-8">
            <div className="text-emerald-400 text-sm font-bold uppercase tracking-wide mb-2">📈 INGRESOS</div>
            <div className="text-5xl font-bold text-emerald-400 mb-3">
              {loading ? '...' : formatearMoneda(totalIngresos)}
            </div>
            <div className="text-slate-400">Total registrado en {año}</div>
          </div>

          {/* EGRESOS */}
          <div className="bg-gradient-to-br from-red-900/30 to-red-900/10 border-2 border-red-500/50 rounded-xl p-8">
            <div className="text-red-400 text-sm font-bold uppercase tracking-wide mb-2">📉 EGRESOS</div>
            <div className="text-5xl font-bold text-red-400 mb-3">
              {loading ? '...' : formatearMoneda(totalEgresos)}
            </div>
            <div className="text-slate-400">Total registrado en {año}</div>
          </div>

          {/* BALANCE */}
          <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-cyan-900/30 to-cyan-900/10 border-2 border-cyan-500/50' : 'from-amber-900/30 to-amber-900/10 border-2 border-amber-500/50'} rounded-xl p-8`}>
            <div className={`text-sm font-bold uppercase tracking-wide mb-2 ${balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
              ⚖️ BALANCE
            </div>
            <div className={`text-5xl font-bold mb-3 ${balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
              {loading ? '...' : formatearMoneda(balance)}
            </div>
            <div className="text-slate-400">{balance >= 0 ? '✓ Situación positiva' : '⚠ Situación negativa'}</div>
          </div>
        </div>

        {/* TABLA DE DESGLOSE */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Desglose por Concepto</h2>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Cargando datos...</div>
          ) : conceptos.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-xl mb-4">No hay datos registrados para {año}</p>
              <Link href="/ingresos" className="text-emerald-400 hover:text-emerald-300 font-bold">
                Comienza a registrar transacciones →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-4 px-4 text-slate-300 font-bold">CONCEPTO</th>
                    <th className="text-right py-4 px-4 text-emerald-400 font-bold">INGRESOS</th>
                    <th className="text-right py-4 px-4 text-red-400 font-bold">EGRESOS</th>
                    <th className="text-right py-4 px-4 text-cyan-400 font-bold">BALANCE</th>
                    <th className="text-right py-4 px-4 text-slate-300 font-bold">%</th>
                  </tr>
                </thead>
                <tbody>
                  {conceptos.map((c, idx) => (
                    <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-800/50 transition">
                      <td className="py-4 px-4 text-white font-semibold">{c.concepto}</td>
                      <td className="text-right py-4 px-4 text-emerald-400 font-bold">{formatearMoneda(c.ingresos)}</td>
                      <td className="text-right py-4 px-4 text-red-400 font-bold">{formatearMoneda(c.egresos)}</td>
                      <td className={`text-right py-4 px-4 font-bold ${c.balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
                        {formatearMoneda(c.balance)}
                      </td>
                      <td className="text-right py-4 px-4 text-slate-400 font-bold">
                        {totalIngresos > 0 ? ((c.ingresos / totalIngresos) * 100).toFixed(1) : '0'}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-800/50 border-t-2 border-slate-600/50 font-bold">
                    <td className="py-4 px-4 text-white">TOTAL</td>
                    <td className="text-right py-4 px-4 text-emerald-400">{formatearMoneda(totalIngresos)}</td>
                    <td className="text-right py-4 px-4 text-red-400">{formatearMoneda(totalEgresos)}</td>
                    <td className={`text-right py-4 px-4 ${balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
                      {formatearMoneda(balance)}
                    </td>
                    <td className="text-right py-4 px-4 text-slate-300">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FOOTER INFO */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Período fiscal: <span className="text-cyan-400 font-bold">{año}</span></p>
          <p className="mt-2">Dashboard v2.1 - Interfaz Mejorada ✨</p>
        </div>
      </div>
    </div>
  );
}
