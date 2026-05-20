'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { formatearMoneda, obtenerAñoActual } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Plus, Eye } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md shadow-lg">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 font-montserrat">Acceso Requerido</h2>
          <p className="text-slate-600 mb-8">Debes iniciar sesión para acceder al dashboard.</p>
          <Link href="/auth/login" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg">
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
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-slate-900 mb-2 font-montserrat">Dashboard Financiero</h1>
          <p className="text-slate-600">Bienvenido, {usuario?.nombre || 'Usuario'} • Mayo 2026</p>
        </div>

        {/* PERIODO SELECTOR BLOCK */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-700 font-semibold text-lg">Período</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAño(año - 1)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg transition shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-4xl font-bold text-blue-500 w-24 text-center font-montserrat">{año}</span>
              <button
                onClick={() => setAño(año + 1)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg transition shadow-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* KPI CARDS - CLEAN & MODULAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* INGRESOS */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-emerald-600 text-sm font-bold uppercase tracking-wide mb-3 font-montserrat">INGRESOS</div>
            <div className="text-4xl font-bold text-slate-900 mb-2 font-montserrat">
              {loading ? '...' : formatearMoneda(totalIngresos)}
            </div>
            <div className="text-slate-500 text-sm">Total registrado en {año}</div>
          </div>

          {/* EGRESOS */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-red-500 text-sm font-bold uppercase tracking-wide mb-3 font-montserrat">EGRESOS</div>
            <div className="text-4xl font-bold text-slate-900 mb-2 font-montserrat">
              {loading ? '...' : formatearMoneda(totalEgresos)}
            </div>
            <div className="text-slate-500 text-sm">Total registrado en {año}</div>
          </div>

          {/* BALANCE */}
          <div className={`bg-white border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow ${balance >= 0 ? 'border-cyan-200' : 'border-orange-200'}`}>
            <div className={`text-sm font-bold uppercase tracking-wide mb-3 font-montserrat ${balance >= 0 ? 'text-cyan-600' : 'text-orange-600'}`}>
              BALANCE
            </div>
            <div className={`text-4xl font-bold mb-2 font-montserrat ${balance >= 0 ? 'text-cyan-600' : 'text-orange-600'}`}>
              {loading ? '...' : formatearMoneda(balance)}
            </div>
            <div className="text-slate-500 text-sm">{balance >= 0 ? 'Situación positiva' : 'Situación negativa'}</div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/ingresos" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-lg flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg active:scale-95">
            <Plus className="w-5 h-5" />
            Registrar Ingreso
          </Link>
          <Link href="/egresos" className="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-8 rounded-lg flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg active:scale-95">
            <Plus className="w-5 h-5" />
            Registrar Egreso
          </Link>
          <Link href="/reportes" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg active:scale-95">
            <Eye className="w-5 h-5" />
            Ver Reportes
          </Link>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 font-montserrat">Desglose por Concepto</h2>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Cargando datos...</div>
          ) : conceptos.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg mb-4">No hay datos registrados para {año}</p>
              <Link href="/ingresos" className="text-blue-500 hover:text-blue-600 font-semibold">
                Comienza a registrar transacciones →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-4 px-4 text-slate-700 font-semibold text-sm font-montserrat">CONCEPTO</th>
                    <th className="text-right py-4 px-4 text-slate-700 font-semibold text-sm font-montserrat">INGRESOS</th>
                    <th className="text-right py-4 px-4 text-slate-700 font-semibold text-sm font-montserrat">EGRESOS</th>
                    <th className="text-right py-4 px-4 text-slate-700 font-semibold text-sm font-montserrat">BALANCE</th>
                    <th className="text-right py-4 px-4 text-slate-700 font-semibold text-sm font-montserrat">%</th>
                  </tr>
                </thead>
                <tbody>
                  {conceptos.map((c, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="py-4 px-4 text-slate-900 font-medium">{c.concepto}</td>
                      <td className="text-right py-4 px-4 text-emerald-600 font-semibold">{formatearMoneda(c.ingresos)}</td>
                      <td className="text-right py-4 px-4 text-red-500 font-semibold">{formatearMoneda(c.egresos)}</td>
                      <td className={`text-right py-4 px-4 font-semibold ${c.balance >= 0 ? 'text-cyan-600' : 'text-orange-600'}`}>
                        {formatearMoneda(c.balance)}
                      </td>
                      <td className="text-right py-4 px-4 text-slate-600 font-semibold">
                        {totalIngresos > 0 ? ((c.ingresos / totalIngresos) * 100).toFixed(1) : '0'}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 border-t-2 border-slate-200">
                    <td className="py-4 px-4 text-slate-900 font-bold font-montserrat">TOTAL</td>
                    <td className="text-right py-4 px-4 text-emerald-600 font-bold">{formatearMoneda(totalIngresos)}</td>
                    <td className="text-right py-4 px-4 text-red-500 font-bold">{formatearMoneda(totalEgresos)}</td>
                    <td className={`text-right py-4 px-4 font-bold ${balance >= 0 ? 'text-cyan-600' : 'text-orange-600'}`}>
                      {formatearMoneda(balance)}
                    </td>
                    <td className="text-right py-4 px-4 text-slate-700 font-bold">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Dashboard v3.0 - Diseño Moderno | Período fiscal: <span className="text-slate-700 font-semibold">{año}</span></p>
        </div>
      </div>
    </div>
  );
}
