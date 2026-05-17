'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { formatearMoneda, obtenerAñoActual } from '@/lib/utils';
import type { ReporteAnalytics } from '@/lib/types';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Target } from 'lucide-react';

export default function ReportesPage() {
  const { usuario, loading: authLoading } = useAuth();
  const [año, setAño] = useState(obtenerAñoActual());
  const [reporte, setReporte] = useState<ReporteAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && usuario) {
      cargarReporte();
    }
  }, [año, usuario, authLoading]);

  async function cargarReporte() {
    setLoading(true);
    try {
      const response = await fetch(`/api/reportes?usuario=${usuario?.id}&año=${año}`);
      if (!response.ok) throw new Error('Error al cargar reporte');
      const data = await response.json();
      setReporte(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-slate-700/30 pb-8 mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            📊 Reportes
          </h1>
          <p className="text-slate-400">Análisis y estadísticas de tus finanzas</p>
        </div>

        {/* Year Selector */}
        <Card variant="premium" className="mb-8">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-semibold uppercase">Período</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setAño(año - 1)} className="p-2 hover:bg-slate-700/40 rounded-lg transition">
                <ChevronLeft className="w-5 h-5 text-blue-400" />
              </button>
              <span className="text-4xl font-bold w-20 text-center text-cyan-400">{año}</span>
              <button onClick={() => setAño(año + 1)} className="p-2 hover:bg-slate-700/40 rounded-lg transition">
                <ChevronRight className="w-5 h-5 text-blue-400" />
              </button>
            </div>
          </div>
        </Card>

        {loading ? (
          <LoadingState />
        ) : reporte ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Ingresos Card */}
              <Card variant="premium" className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-500/20 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <Badge variant="income">Ingresos</Badge>
                </div>
                <h2 className="text-4xl font-bold text-emerald-400 mb-1">{formatearMoneda(reporte.totalIngresos)}</h2>
                <p className="text-sm text-slate-400">Total de ingresos</p>
              </Card>

              {/* Egresos Card */}
              <Card variant="premium" className="bg-gradient-to-br from-red-500/10 to-red-600/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-500/20 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  </div>
                  <Badge variant="expense">Egresos</Badge>
                </div>
                <h2 className="text-4xl font-bold text-red-400 mb-1">{formatearMoneda(reporte.totalEgresos)}</h2>
                <p className="text-sm text-slate-400">Total de egresos</p>
              </Card>

              {/* Balance Card */}
              <Card
                variant="premium"
                className={`bg-gradient-to-br ${
                  reporte.balance >= 0
                    ? 'from-cyan-500/10 to-cyan-600/5'
                    : 'from-amber-500/10 to-amber-600/5'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${
                      reporte.balance >= 0
                        ? 'bg-cyan-500/20'
                        : 'bg-amber-500/20'
                    }`}
                  >
                    <Target
                      className={`w-6 h-6 ${
                        reporte.balance >= 0
                          ? 'text-cyan-400'
                          : 'text-amber-400'
                      }`}
                    />
                  </div>
                  <Badge variant={reporte.balance >= 0 ? 'balance' : 'neutral'}>
                    {reporte.balance >= 0 ? 'Positivo' : 'Negativo'}
                  </Badge>
                </div>
                <h2
                  className={`text-4xl font-bold mb-1 ${
                    reporte.balance >= 0
                      ? 'text-cyan-400'
                      : 'text-amber-400'
                  }`}
                >
                  {formatearMoneda(reporte.balance)}
                </h2>
                <p className="text-sm text-slate-400">Balance</p>
              </Card>
            </div>

            {/* Top Conceptos */}
            <Card variant="premium">
              <h3 className="text-2xl font-bold text-slate-100 mb-6">Top Categorías</h3>

              {reporte.conceptosMasAltos.length === 0 ? (
                <p className="text-slate-400 text-center py-8">Sin movimientos registrados</p>
              ) : (
                <div className="space-y-4">
                  {reporte.conceptosMasAltos.map((concepto, idx) => (
                    <div key={idx} className="p-4 bg-slate-800/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-100">{concepto.concepto}</h4>
                        <span className="text-sm font-bold text-cyan-400">{concepto.porcentaje.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                            style={{ width: `${concepto.porcentaje}%` }}
                          />
                        </div>
                        <span className="text-right min-w-fit text-slate-300 font-semibold">
                          {formatearMoneda(concepto.monto)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}
