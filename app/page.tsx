'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { getResumenPorConcepto } from '@/lib/supabase';
import { formatearMoneda, obtenerAñoActual } from '@/lib/utils';
import { TrendingUp, TrendingDown, DollarSign, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const EXPENSE_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e'];

export default function Dashboard() {
  const { usuario, loading: authLoading } = useAuth();
  const [conceptos, setConceptos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [año, setAño] = useState(obtenerAñoActual());

  useEffect(() => {
    async function cargarDatos() {
      if (!usuario) return;
      try {
        const resumen = await getResumenPorConcepto(usuario.id, año);
        setConceptos(resumen);
      } catch (error) {
        console.error('Error al cargar datos:', error);
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

  const totalIngresos = conceptos.reduce((sum, c) => sum + c.ingresos, 0);
  const totalEgresos = conceptos.reduce((sum, c) => sum + c.egresos, 0);
  const balance = totalIngresos - totalEgresos;
  const balancePercentage = totalIngresos > 0 ? (balance / totalIngresos) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard Financiero</h1>
          <p className="text-slate-400 text-lg">Resumen de ingresos y egresos - {año}</p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center justify-between mb-8 bg-slate-900 rounded-lg border border-slate-800 p-4">
          <button
            onClick={() => setAño(año - 1)}
            className="p-2 hover:bg-slate-800 rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span className="text-2xl font-bold text-white">{año}</span>
          </div>
          <button
            onClick={() => setAño(año + 1)}
            className="p-2 hover:bg-slate-800 rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Ingresos Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-medium">Ingresos Totales</span>
              <div className="bg-emerald-500/20 p-2 rounded">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-5xl font-black text-emerald-400 mb-4">
              {loading ? '---' : formatearMoneda(totalIngresos)}
            </h3>
            <div className="text-sm text-slate-500">Año {año}</div>
          </div>

          {/* Egresos Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-medium">Egresos Totales</span>
              <div className="bg-red-500/20 p-2 rounded">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <h3 className="text-5xl font-black text-red-400 mb-4">
              {loading ? '---' : formatearMoneda(totalEgresos)}
            </h3>
            <div className="text-sm text-slate-500">Año {año}</div>
          </div>

          {/* Balance Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-medium">Balance Neto</span>
              <div className={`p-2 rounded ${balance >= 0 ? 'bg-blue-500/20' : 'bg-amber-500/20'}`}>
                <DollarSign className={`w-5 h-5 ${balance >= 0 ? 'text-blue-400' : 'text-amber-400'}`} />
              </div>
            </div>
            <h3 className={`text-5xl font-black mb-4 ${balance >= 0 ? 'text-blue-400' : 'text-amber-400'}`}>
              {loading ? '---' : formatearMoneda(balance)}
            </h3>
            <div className="text-sm text-slate-500">Ratio: {totalEgresos > 0 ? (totalIngresos / totalEgresos).toFixed(2) : '0.00'}x</div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Resumen Detallado - Año {año}</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800 border-b border-slate-700">
                  <th className="px-6 py-4 text-left font-semibold text-slate-300 text-sm">CONCEPTO</th>
                  <th className="px-6 py-4 text-right font-semibold text-emerald-400 text-sm">INGRESOS</th>
                  <th className="px-6 py-4 text-right font-semibold text-red-400 text-sm">EGRESOS</th>
                  <th className="px-6 py-4 text-right font-semibold text-blue-400 text-sm">BALANCE</th>
                  <th className="px-6 py-4 text-right font-semibold text-slate-300 text-sm">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Cargando datos...
                    </td>
                  </tr>
                ) : conceptos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No hay datos disponibles
                    </td>
                  </tr>
                ) : (
                  <>
                    {conceptos.map((concepto, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-800/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-5 font-medium text-slate-100">{concepto.concepto}</td>
                        <td className="px-6 py-5 text-right font-bold text-emerald-400">{formatearMoneda(concepto.ingresos)}</td>
                        <td className="px-6 py-5 text-right font-bold text-red-400">{formatearMoneda(concepto.egresos)}</td>
                        <td className={`px-6 py-5 text-right font-bold ${concepto.balance >= 0 ? 'text-blue-400' : 'text-amber-400'}`}>
                          {formatearMoneda(concepto.balance)}
                        </td>
                        <td className="px-6 py-5 text-right text-slate-400">
                          {totalIngresos > 0 ? ((concepto.ingresos / totalIngresos) * 100).toFixed(1) : '0'}%
                        </td>
                      </tr>
                    ))}
                    {conceptos.length > 0 && (
                      <tr className="bg-slate-800 border-t-2 border-slate-700 font-bold">
                        <td className="px-6 py-5 text-slate-100">TOTAL GENERAL</td>
                        <td className="px-6 py-5 text-right text-emerald-400 text-lg">{formatearMoneda(totalIngresos)}</td>
                        <td className="px-6 py-5 text-right text-red-400 text-lg">{formatearMoneda(totalEgresos)}</td>
                        <td className={`px-6 py-5 text-right text-lg ${balance >= 0 ? 'text-blue-400' : 'text-amber-400'}`}>
                          {formatearMoneda(balance)}
                        </td>
                        <td className="px-6 py-5 text-right text-slate-300">100%</td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
