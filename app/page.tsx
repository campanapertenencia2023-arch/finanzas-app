'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { formatearMoneda, obtenerAñoActual } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import type { ReporteAnalytics, ResumenConcepto } from '@/lib/types';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Target, Eye } from 'lucide-react';

export default function Dashboard() {
  const { usuario, loading: authLoading } = useAuth();
  const [año, setAño] = useState(obtenerAñoActual());
  const [reporte, setReporte] = useState<ReporteAnalytics | null>(null);
  const [resumen, setResumen] = useState<ResumenConcepto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'visualization' | 'table'>('visualization');

  useEffect(() => {
    if (!authLoading && usuario) {
      cargarDatos();
    }
  }, [año, usuario, authLoading]);

  async function cargarDatos() {
    setLoading(true);
    try {
      const [reporteRes, resumenRes] = await Promise.all([
        fetch(`/api/reportes?usuario=${usuario?.id}&año=${año}`),
        fetch(`/api/resumen?usuario=${usuario?.id}&año=${año}`)
      ]);

      if (reporteRes.ok) {
        const reporteData = await reporteRes.json();
        setReporte(reporteData.data);
      }

      if (resumenRes.ok) {
        const resumenData = await resumenRes.json();
        setResumen(resumenData || []);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-slate-700/30 pb-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                💼 Dashboard Financiero
              </h1>
              <p className="text-slate-400">Control total de flujos y conceptos financieros</p>
            </div>
          </div>
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
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-emerald-500/20 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-emerald-400" />
                  </div>
                  <Badge variant="income">Ingresos</Badge>
                </div>
                <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">Total Ingresos</p>
                <h2 className="text-5xl font-bold text-emerald-400 mb-2">{formatearMoneda(reporte.totalIngresos)}</h2>
                <p className="text-xs text-slate-500">Dinero entrada</p>
              </Card>

              {/* Egresos Card */}
              <Card variant="premium" className="bg-gradient-to-br from-red-500/10 to-red-600/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-red-500/20 rounded-2xl">
                    <TrendingDown className="w-8 h-8 text-red-400" />
                  </div>
                  <Badge variant="expense">Egresos</Badge>
                </div>
                <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">Total Egresos</p>
                <h2 className="text-5xl font-bold text-red-400 mb-2">{formatearMoneda(reporte.totalEgresos)}</h2>
                <p className="text-xs text-slate-500">Dinero salida</p>
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
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`p-4 rounded-2xl ${
                      reporte.balance >= 0 ? 'bg-cyan-500/20' : 'bg-amber-500/20'
                    }`}
                  >
                    <Target
                      className={`w-8 h-8 ${
                        reporte.balance >= 0 ? 'text-cyan-400' : 'text-amber-400'
                      }`}
                    />
                  </div>
                  <Badge variant={reporte.balance >= 0 ? 'balance' : 'neutral'}>
                    {reporte.balance >= 0 ? 'Positivo' : 'Negativo'}
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">Balance Neto</p>
                <h2
                  className={`text-5xl font-bold mb-2 ${
                    reporte.balance >= 0 ? 'text-cyan-400' : 'text-amber-400'
                  }`}
                >
                  {formatearMoneda(reporte.balance)}
                </h2>
                <p className="text-xs text-slate-500">Diferencia</p>
              </Card>
            </div>

            {/* Tabs/View Options */}
            <Card variant="premium" className="mb-8">
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveView('visualization')}
                  className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                    activeView === 'visualization'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Visualización
                </button>
                <button
                  onClick={() => setActiveView('table')}
                  className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                    activeView === 'table'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  📊 Tabla de datos
                </button>
              </div>
            </Card>

            {/* Top Conceptos - Visualization View */}
            {activeView === 'visualization' && (
              <Card variant="premium">
                <h3 className="text-2xl font-bold text-slate-100 mb-8">🏆 Top Categorías por Monto</h3>

                {reporte.conceptosMasAltos.length === 0 ? (
                  <p className="text-slate-400 text-center py-12">Sin movimientos registrados</p>
                ) : (
                  <div className="space-y-6">
                    {reporte.conceptosMasAltos.map((concepto, idx) => (
                      <div key={idx} className="group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-cyan-400 w-8">{idx + 1}</span>
                            <h4 className="font-semibold text-slate-100 text-lg">{concepto.concepto}</h4>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-cyan-400">{formatearMoneda(concepto.monto)}</p>
                            <p className="text-sm text-slate-400">{concepto.porcentaje.toFixed(1)}% del total</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-3 bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              style={{ width: `${Math.min(concepto.porcentaje, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Table View */}
            {activeView === 'table' && (
              <Card variant="premium">
                <h3 className="text-2xl font-bold text-slate-100 mb-6">📋 Resumen por Concepto</h3>

                {resumen.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No hay datos disponibles</p>
                ) : (
                  <Table
                    columns={[
                      { key: 'concepto', label: 'Concepto', align: 'left' },
                      {
                        key: 'ingresos',
                        label: 'Ingresos',
                        align: 'right',
                        render: (v) => <span className="text-emerald-400 font-semibold">{formatearMoneda(v)}</span>
                      },
                      {
                        key: 'egresos',
                        label: 'Egresos',
                        align: 'right',
                        render: (v) => <span className="text-red-400 font-semibold">{formatearMoneda(v)}</span>
                      },
                      {
                        key: 'balance',
                        label: 'Balance',
                        align: 'right',
                        render: (v) => (
                          <span className={`font-semibold ${v >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
                            {formatearMoneda(v)}
                          </span>
                        )
                      }
                    ]}
                    data={resumen}
                  />
                )}
              </Card>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
