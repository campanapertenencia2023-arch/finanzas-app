'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getResumenPorConcepto } from '@/lib/supabase';
import { formatearMoneda, obtenerAñoActual } from '@/lib/utils';
import { TrendingUp, TrendingDown, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const totalIngresos = conceptos.reduce((sum, c) => sum + c.ingresos, 0);
  const totalEgresos = conceptos.reduce((sum, c) => sum + c.egresos, 0);
  const balance = totalIngresos - totalEgresos;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 px-8 py-8">
        <h1 className="text-3xl font-light tracking-tight mb-2">Dashboard Financiero</h1>
        <p className="text-slate-400 text-sm">Análisis de flujos y conceptos</p>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Year Selector */}
        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={() => setAño(año - 1)}
            className="p-2 hover:bg-slate-900 rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-2xl font-light w-16 text-center">{año}</span>
          <button
            onClick={() => setAño(año + 1)}
            className="p-2 hover:bg-slate-900 rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {/* Ingresos */}
          <div className="border border-slate-800 rounded p-6 hover:border-slate-700 transition-colors">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mb-4" />
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">Ingresos</p>
            <h2 className="text-4xl font-light text-emerald-400 tracking-tight">
              {loading ? '—' : formatearMoneda(totalIngresos)}
            </h2>
          </div>

          {/* Egresos */}
          <div className="border border-slate-800 rounded p-6 hover:border-slate-700 transition-colors">
            <div className="w-2 h-2 bg-red-500 rounded-full mb-4" />
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">Egresos</p>
            <h2 className="text-4xl font-light text-red-400 tracking-tight">
              {loading ? '—' : formatearMoneda(totalEgresos)}
            </h2>
          </div>

          {/* Balance */}
          <div className="border border-slate-800 rounded p-6 hover:border-slate-700 transition-colors">
            <div className={`w-2 h-2 rounded-full mb-4 ${balance >= 0 ? 'bg-cyan-400' : 'bg-amber-500'}`} />
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">Balance</p>
            <h2 className={`text-4xl font-light tracking-tight ${balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
              {loading ? '—' : formatearMoneda(balance)}
            </h2>
          </div>
        </div>

        {/* Table */}
        <div>
          <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-6">Por Concepto</h3>

          <div className="border border-slate-800 rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800">
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-400 font-medium">Concepto</th>
                  <th className="px-6 py-4 text-right text-xs uppercase tracking-wider text-emerald-400 font-medium">Ingresos</th>
                  <th className="px-6 py-4 text-right text-xs uppercase tracking-wider text-red-400 font-medium">Egresos</th>
                  <th className="px-6 py-4 text-right text-xs uppercase tracking-wider text-cyan-400 font-medium">Balance</th>
                  <th className="px-6 py-4 text-right text-xs uppercase tracking-wider text-slate-400 font-medium">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Cargando...
                    </td>
                  </tr>
                ) : conceptos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Sin datos
                    </td>
                  </tr>
                ) : (
                  <>
                    {conceptos.map((concepto, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                        <td className="px-6 py-5 font-light">{concepto.concepto}</td>
                        <td className="px-6 py-5 text-right font-light text-emerald-400">
                          {formatearMoneda(concepto.ingresos)}
                        </td>
                        <td className="px-6 py-5 text-right font-light text-red-400">
                          {formatearMoneda(concepto.egresos)}
                        </td>
                        <td className={`px-6 py-5 text-right font-light ${concepto.balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
                          {formatearMoneda(concepto.balance)}
                        </td>
                        <td className="px-6 py-5 text-right text-slate-400 font-light">
                          {totalIngresos > 0 ? ((concepto.ingresos / totalIngresos) * 100).toFixed(0) : '0'}%
                        </td>
                      </tr>
                    ))}
                    {conceptos.length > 0 && (
                      <tr className="bg-slate-900 border-t-2 border-slate-700 font-medium">
                        <td className="px-6 py-5">Total</td>
                        <td className="px-6 py-5 text-right text-emerald-400">
                          {formatearMoneda(totalIngresos)}
                        </td>
                        <td className="px-6 py-5 text-right text-red-400">
                          {formatearMoneda(totalEgresos)}
                        </td>
                        <td className={`px-6 py-5 text-right ${balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
                          {formatearMoneda(balance)}
                        </td>
                        <td className="px-6 py-5 text-right text-slate-400">100%</td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500">
          <span>Año {año}</span>
          <span>Última actualización: hoy</span>
        </div>
      </div>
    </div>
  );
}
