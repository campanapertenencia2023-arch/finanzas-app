'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { getResumenPorConcepto } from '@/lib/supabase';
import { formatearMoneda, obtenerAñoActual } from '@/lib/utils';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
};

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

  const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const EXPENSE_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -ml-48 -mb-48" />
      </div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Dashboard Financiero
              </h1>
            </div>
            <div className="text-sm text-slate-400">
              {usuario && `Bienvenido, ${usuario.nombre}`}
            </div>
          </div>
          <p className="text-slate-400">Análisis integral de tus finanzas - {año}</p>
        </motion.div>

        {/* Year Selector */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-center gap-6 bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 w-fit mx-auto">
            <motion.button
              onClick={() => setAño(año - 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600 text-slate-300 rounded-lg transition-all border border-slate-600/50 hover:border-slate-500"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </motion.button>
            <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text min-w-24 text-center">
              {año}
            </span>
            <motion.button
              onClick={() => setAño(año + 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600 text-slate-300 rounded-lg transition-all border border-slate-600/50 hover:border-slate-500"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Ingresos Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-emerald-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-slate-800/50 backdrop-blur-lg border border-emerald-500/20 group-hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Total Ingresos</p>
                  <p className="text-4xl font-bold text-emerald-400">
                    {loading ? '---' : formatearMoneda(totalIngresos)}
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div className="text-xs text-slate-500">Año {año}</div>
            </div>
          </motion.div>

          {/* Egresos Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-slate-800/50 backdrop-blur-lg border border-red-500/20 group-hover:border-red-500/40 rounded-2xl p-6 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Total Egresos</p>
                  <p className="text-4xl font-bold text-red-400">
                    {loading ? '---' : formatearMoneda(totalEgresos)}
                  </p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                </div>
              </div>
              <div className="text-xs text-slate-500">Año {año}</div>
            </div>
          </motion.div>

          {/* Balance Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="relative group overflow-hidden"
          >
            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              balance >= 0
                ? 'bg-gradient-to-r from-blue-600/20 to-blue-400/10'
                : 'bg-gradient-to-r from-orange-600/20 to-orange-400/10'
            }`} />
            <div className={`relative bg-slate-800/50 backdrop-blur-lg border rounded-2xl p-6 transition-all duration-300 ${
              balance >= 0
                ? 'border-blue-500/20 group-hover:border-blue-500/40'
                : 'border-orange-500/20 group-hover:border-orange-500/40'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Balance</p>
                  <p className={`text-4xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                    {loading ? '---' : formatearMoneda(balance)}
                  </p>
                </div>
                <div className={`p-3 rounded-lg border ${
                  balance >= 0
                    ? 'bg-blue-500/10 border-blue-500/20'
                    : 'bg-orange-500/10 border-orange-500/20'
                }`}>
                  <BarChart3 className={`w-6 h-6 ${balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`} />
                </div>
              </div>
              <div className="text-xs text-slate-500">Año {año}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Ingresos Chart */}
          <div className="relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 group-hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Ingresos por Concepto</h3>
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
                      outerRadius={80}
                      fill="#10b981"
                      dataKey="value"
                    >
                      {conceptos.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatearMoneda(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500 text-center py-8">Sin datos de ingresos</p>
              )}
            </div>
          </div>

          {/* Egresos Chart */}
          <div className="relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 group-hover:border-red-500/30 rounded-2xl p-6 transition-all duration-300">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Egresos por Concepto</h3>
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
                      outerRadius={80}
                      fill="#ef4444"
                      dataKey="value"
                    >
                      {conceptos.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatearMoneda(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500 text-center py-8">Sin datos de egresos</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Comparative Chart */}
        <motion.div variants={itemVariants} className="relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 group-hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Comparativo: Ingresos vs Egresos</h3>
            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <p className="text-slate-500">Cargando...</p>
              </div>
            ) : conceptos.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conceptos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="concepto" angle={-45} textAnchor="end" height={80} stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip formatter={(value) => formatearMoneda(value)} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="egresos" fill="#ef4444" name="Egresos" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="balance" fill="#3b82f6" name="Balance" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-center py-8">Sin datos disponibles</p>
            )}
          </div>
        </motion.div>

        {/* Summary Table */}
        <motion.div variants={itemVariants} className="mt-8 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 group-hover:border-slate-600 rounded-2xl overflow-hidden transition-all duration-300">
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/40 px-6 py-4 border-b border-slate-700/50">
              <h2 className="text-xl font-bold text-slate-200">Resumen por Concepto - Año {año}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/30 border-b border-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Concepto</th>
                    <th className="px-6 py-4 text-right font-semibold text-emerald-400">Ingresos</th>
                    <th className="px-6 py-4 text-right font-semibold text-red-400">Egresos</th>
                    <th className="px-6 py-4 text-right font-semibold text-blue-400">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-slate-500">
                        Cargando...
                      </td>
                    </tr>
                  ) : conceptos.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-slate-500">
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
                          className="hover:bg-slate-700/20 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 font-medium text-slate-200">{concepto.concepto}</td>
                          <td className="px-6 py-4 text-right font-semibold text-emerald-400">
                            {formatearMoneda(concepto.ingresos)}
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-red-400">
                            {formatearMoneda(concepto.egresos)}
                          </td>
                          <td className={`px-6 py-4 text-right font-semibold ${concepto.balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                            {formatearMoneda(concepto.balance)}
                          </td>
                        </motion.tr>
                      ))}
                      {conceptos.length > 0 && (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-slate-700/40 font-bold border-t-2 border-slate-700"
                        >
                          <td className="px-6 py-4 text-slate-200">TOTAL</td>
                          <td className="px-6 py-4 text-right text-emerald-400">
                            {formatearMoneda(totalIngresos)}
                          </td>
                          <td className="px-6 py-4 text-right text-red-400">
                            {formatearMoneda(totalEgresos)}
                          </td>
                          <td className={`px-6 py-4 text-right ${balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                            {formatearMoneda(balance)}
                          </td>
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
