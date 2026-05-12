'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { getResumenPorConcepto } from '@/lib/supabase';
import { formatearMoneda, obtenerAñoActual } from '@/lib/utils';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, ChevronLeft, ChevronRight, Zap, Target, Award } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6 md:p-12 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl -mr-40 animate-pulse" />
        <div className="absolute bottom-10 left-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl -ml-48 animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Header */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 via-slate-800/50 to-transparent border border-slate-700/50 p-12 md:p-16">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Dashboard Financiero</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-4">
                Tu Salud Financiera
              </h1>
              <p className="text-slate-400 text-xl max-w-2xl">
                Análisis completo de tus ingresos y egresos con visualización avanzada
              </p>
            </div>
          </div>
        </motion.div>

        {/* Year Selector */}
        <motion.div variants={itemVariants} className="mb-20 flex justify-center">
          <div className="relative bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/50 transition-all">
            <div className="flex items-center gap-8">
              <motion.button
                onClick={() => setAño(año - 1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 rounded-xl transition-all border border-slate-500/30 hover:border-slate-400/50 font-semibold"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <div className="text-center">
                <p className="text-slate-400 text-sm uppercase tracking-widest mb-1">Año Fiscal</p>
                <p className="text-5xl font-black text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text">
                  {año}
                </p>
              </div>

              <motion.button
                onClick={() => setAño(año + 1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 rounded-xl transition-all border border-slate-500/30 hover:border-slate-400/50 font-semibold"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Ingresos */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500" />
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl border border-emerald-500/20 group-hover:border-emerald-500/40 rounded-3xl p-12 overflow-hidden transition-all">
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-emerald-500 to-transparent" />
              <div className="relative space-y-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-emerald-400/80 text-xs font-bold uppercase tracking-widest mb-3">Ingresos Totales</p>
                    <h3 className="text-6xl md:text-7xl font-black text-emerald-400 leading-none">
                      {loading ? '---' : formatearMoneda(totalIngresos)}
                    </h3>
                  </div>
                  <div className="p-5 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 group-hover:scale-110 transition-transform flex-shrink-0">
                    <TrendingUp className="w-10 h-10 text-emerald-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-slate-700/50">
                  <span className="text-sm text-slate-400">Año {año}</span>
                  <span className="text-sm font-bold text-emerald-400">+12.5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Egresos */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500" />
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl border border-red-500/20 group-hover:border-red-500/40 rounded-3xl p-12 overflow-hidden transition-all">
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-red-500 to-transparent" />
              <div className="relative space-y-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-red-400/80 text-xs font-bold uppercase tracking-widest mb-3">Egresos Totales</p>
                    <h3 className="text-6xl md:text-7xl font-black text-red-400 leading-none">
                      {loading ? '---' : formatearMoneda(totalEgresos)}
                    </h3>
                  </div>
                  <div className="p-5 bg-red-500/20 rounded-2xl border border-red-500/30 group-hover:scale-110 transition-transform flex-shrink-0">
                    <TrendingDown className="w-10 h-10 text-red-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-slate-700/50">
                  <span className="text-sm text-slate-400">Año {año}</span>
                  <span className="text-sm font-bold text-red-400">-8.3%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500" />
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-xl border border-blue-500/20 group-hover:border-blue-500/40 rounded-3xl p-12 overflow-hidden transition-all">
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500 to-transparent" />
              <div className="relative space-y-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${
                      balance >= 0 ? 'text-blue-400/80' : 'text-amber-400/80'
                    }`}>Balance Neto</p>
                    <h3 className={`text-6xl md:text-7xl font-black leading-none ${
                      balance >= 0 ? 'text-blue-400' : 'text-amber-400'
                    }`}>
                      {loading ? '---' : formatearMoneda(balance)}
                    </h3>
                  </div>
                  <div className={`p-5 rounded-2xl border transition-transform group-hover:scale-110 flex-shrink-0 ${
                    balance >= 0
                      ? 'bg-blue-500/20 border-blue-500/30'
                      : 'bg-amber-500/20 border-amber-500/30'
                  }`}>
                    <BarChart3 className={`w-10 h-10 ${balance >= 0 ? 'text-blue-400' : 'text-amber-400'}`} />
                  </div>
                </div>
                <div className="space-y-4 pt-8 border-t border-slate-700/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Ratio Ingresos/Egresos</span>
                    <span className="text-sm font-bold text-slate-200">{totalEgresos > 0 ? (totalIngresos / totalEgresos).toFixed(2) : '0.00'}x</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${
                      balance >= 0
                        ? 'from-blue-500 to-cyan-400'
                        : 'from-amber-500 to-orange-400'
                    }`} style={{ width: `${Math.min(balancePercentage, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Ingresos Distribution */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl border border-slate-700/50 group-hover:border-emerald-500/30 rounded-2xl p-8 transition-all">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded" />
                  Distribución de Ingresos
                </h3>
              </div>
              {loading ? (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-slate-500">Cargando...</p>
                </div>
              ) : conceptos.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={conceptos.filter(c => c.ingresos > 0).map(c => ({
                        name: c.concepto,
                        value: parseFloat(c.ingresos.toString())
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${formatearMoneda(value)}`}
                      outerRadius={90}
                      fill="#10b981"
                      dataKey="value"
                    >
                      {conceptos.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatearMoneda(Number(value) || 0)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500 text-center py-20">Sin datos</p>
              )}
            </div>
          </div>

          {/* Egresos Distribution */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl border border-slate-700/50 group-hover:border-red-500/30 rounded-2xl p-8 transition-all">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-orange-400 rounded" />
                  Distribución de Egresos
                </h3>
              </div>
              {loading ? (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-slate-500">Cargando...</p>
                </div>
              ) : conceptos.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={conceptos.filter(c => c.egresos > 0).map(c => ({
                        name: c.concepto,
                        value: parseFloat(c.egresos.toString())
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${formatearMoneda(value)}`}
                      outerRadius={90}
                      fill="#ef4444"
                      dataKey="value"
                    >
                      {conceptos.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatearMoneda(Number(value) || 0)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500 text-center py-20">Sin datos</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Comparative Bar Chart */}
        <motion.div variants={itemVariants} className="group relative mb-16">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl border border-slate-700/50 group-hover:border-blue-500/30 rounded-2xl p-8 transition-all">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded" />
                Análisis Comparativo por Concepto
              </h3>
            </div>
            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <p className="text-slate-500">Cargando...</p>
              </div>
            ) : conceptos.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={conceptos} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                  <defs>
                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="concepto" angle={-45} textAnchor="end" height={100} stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip formatter={(value: any) => formatearMoneda(Number(value) || 0)} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '12px' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="ingresos" fill="url(#colorIngresos)" name="Ingresos" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="egresos" fill="url(#colorEgresos)" name="Egresos" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="balance" fill="#3b82f6" name="Balance" radius={[8, 8, 0, 0]} opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-center py-20">Sin datos disponibles</p>
            )}
          </div>
        </motion.div>

        {/* Summary Table */}
        <motion.div variants={itemVariants} className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600/20 to-slate-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500" />
          <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl border border-slate-700/50 group-hover:border-slate-600/50 rounded-2xl overflow-hidden transition-all">
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/40 px-8 py-6 border-b border-slate-700/50">
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                Resumen Detallado - Año {año}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-700/30 border-b border-slate-700/50">
                    <th className="px-8 py-5 text-left font-bold text-slate-200 text-lg">Concepto</th>
                    <th className="px-8 py-5 text-right font-bold text-emerald-400 text-lg">Ingresos</th>
                    <th className="px-8 py-5 text-right font-bold text-red-400 text-lg">Egresos</th>
                    <th className="px-8 py-5 text-right font-bold text-blue-400 text-lg">Balance</th>
                    <th className="px-8 py-5 text-right font-bold text-slate-300 text-lg">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-6 text-center text-slate-500 text-lg">
                        Cargando datos...
                      </td>
                    </tr>
                  ) : conceptos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-6 text-center text-slate-500 text-lg">
                        No hay datos disponibles
                      </td>
                    </tr>
                  ) : (
                    <>
                      {conceptos.map((concepto, idx) => (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-slate-700/20 transition-colors duration-200 group/row border-b border-slate-700/20"
                        >
                          <td className="px-8 py-5 font-bold text-slate-100 text-base group-hover/row:text-slate-50">{concepto.concepto}</td>
                          <td className="px-8 py-5 text-right font-bold text-emerald-400 text-lg">{formatearMoneda(concepto.ingresos)}</td>
                          <td className="px-8 py-5 text-right font-bold text-red-400 text-lg">{formatearMoneda(concepto.egresos)}</td>
                          <td className={`px-8 py-5 text-right font-bold text-lg ${concepto.balance >= 0 ? 'text-blue-400' : 'text-amber-400'}`}>
                            {formatearMoneda(concepto.balance)}
                          </td>
                          <td className="px-8 py-5 text-right text-slate-400 text-base">
                            {totalIngresos > 0 ? ((concepto.ingresos / totalIngresos) * 100).toFixed(1) : '0'}%
                          </td>
                        </motion.tr>
                      ))}
                      {conceptos.length > 0 && (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: conceptos.length * 0.05 }}
                          className="bg-gradient-to-r from-emerald-500/10 to-emerald-400/5 border-t-2 border-emerald-500/30 font-bold"
                        >
                          <td className="px-8 py-6 text-slate-100 text-base">TOTAL GENERAL</td>
                          <td className="px-8 py-6 text-right text-emerald-400 text-xl font-black">{formatearMoneda(totalIngresos)}</td>
                          <td className="px-8 py-6 text-right text-red-400 text-xl font-black">{formatearMoneda(totalEgresos)}</td>
                          <td className={`px-8 py-6 text-right text-xl font-black ${balance >= 0 ? 'text-blue-400' : 'text-amber-400'}`}>
                            {formatearMoneda(balance)}
                          </td>
                          <td className="px-8 py-6 text-right text-slate-300 text-base">100%</td>
                        </motion.tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
