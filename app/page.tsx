'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getResumenPorConcepto } from '@/lib/supabase';
import { formatearMoneda, obtenerAñoActual } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
      <div className="border-b border-slate-800/50 px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-light tracking-tight mb-3">Dashboard Financiero</h1>
          <p className="text-slate-400 text-base">Resumen de flujos y conceptos financieros</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Year Selector */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setAño(año - 1)}
              className="p-3 hover:bg-slate-800 rounded transition-colors duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-4xl font-light w-24 text-center tracking-tight">{año}</span>
            <button
              onClick={() => setAño(año + 1)}
              className="p-3 hover:bg-slate-800 rounded transition-colors duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Ingresos */}
          <div className="border border-slate-800 rounded-lg p-8 hover:border-slate-700 transition-colors duration-200 bg-slate-900/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <p className="text-slate-400 text-sm uppercase tracking-widest font-medium">Ingresos</p>
            </div>
            <h2 className="text-5xl font-light text-emerald-400 tracking-tight">
              {loading ? '—' : formatearMoneda(totalIngresos)}
            </h2>
          </div>

          {/* Egresos */}
          <div className="border border-slate-800 rounded-lg p-8 hover:border-slate-700 transition-colors duration-200 bg-slate-900/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <p className="text-slate-400 text-sm uppercase tracking-widest font-medium">Egresos</p>
            </div>
            <h2 className="text-5xl font-light text-red-400 tracking-tight">
              {loading ? '—' : formatearMoneda(totalEgresos)}
            </h2>
          </div>

          {/* Balance */}
          <div className="border border-slate-800 rounded-lg p-8 hover:border-slate-700 transition-colors duration-200 bg-slate-900/30">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-3 h-3 rounded-full ${balance >= 0 ? 'bg-cyan-400' : 'bg-amber-500'}`} />
              <p className="text-slate-400 text-sm uppercase tracking-widest font-medium">Balance</p>
            </div>
            <h2 className={`text-5xl font-light tracking-tight ${balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
              {loading ? '—' : formatearMoneda(balance)}
            </h2>
          </div>
        </div>

        {/* Table Section */}
        <div>
          <h3 className="text-base uppercase tracking-widest text-slate-400 mb-8 font-medium">Desglose por Concepto</h3>

          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/20">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800">
                  <th className="px-8 py-5 text-left text-xs uppercase tracking-widest text-slate-400 font-medium">Concepto</th>
                  <th className="px-8 py-5 text-right text-xs uppercase tracking-widest text-emerald-400 font-medium">Ingresos</th>
                  <th className="px-8 py-5 text-right text-xs uppercase tracking-widest text-red-400 font-medium">Egresos</th>
                  <th className="px-8 py-5 text-right text-xs uppercase tracking-widest text-cyan-400 font-medium">Balance</th>
                  <th className="px-8 py-5 text-right text-xs uppercase tracking-widest text-slate-400 font-medium">Proporción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-500 text-base">
                      Cargando datos...
                    </td>
                  </tr>
                ) : conceptos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-500 text-base">
                      Sin datos registrados
                    </td>
                  </tr>
                ) : (
                  <>
                    {conceptos.map((concepto, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors duration-150">
                        <td className="px-8 py-5 font-light text-base">{concepto.concepto}</td>
                        <td className="px-8 py-5 text-right font-light text-emerald-400 text-base">
                          {formatearMoneda(concepto.ingresos)}
                        </td>
                        <td className="px-8 py-5 text-right font-light text-red-400 text-base">
                          {formatearMoneda(concepto.egresos)}
                        </td>
                        <td className={`px-8 py-5 text-right font-light text-base ${concepto.balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
                          {formatearMoneda(concepto.balance)}
                        </td>
                        <td className="px-8 py-5 text-right text-slate-400 font-light text-base">
                          {totalIngresos > 0 ? ((concepto.ingresos / totalIngresos) * 100).toFixed(1) : '0'}%
                        </td>
                      </tr>
                    ))}
                    {conceptos.length > 0 && (
                      <tr className="bg-slate-900/50 border-t-2 border-slate-700">
                        <td className="px-8 py-5 font-medium text-base">Total</td>
                        <td className="px-8 py-5 text-right text-emerald-400 font-medium text-base">
                          {formatearMoneda(totalIngresos)}
                        </td>
                        <td className="px-8 py-5 text-right text-red-400 font-medium text-base">
                          {formatearMoneda(totalEgresos)}
                        </td>
                        <td className={`px-8 py-5 text-right font-medium text-base ${balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
                          {formatearMoneda(balance)}
                        </td>
                        <td className="px-8 py-5 text-right text-slate-400 font-medium text-base">100%</td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-16 pt-8 border-t border-slate-800">
          <span className="text-slate-500 text-sm">Período: {año}</span>
          <span className="text-slate-600 text-xs">Actualizado automáticamente</span>
        </div>
      </div>
    </div>
  );
}
