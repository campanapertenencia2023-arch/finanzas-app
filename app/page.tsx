'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { getResumenPorConcepto } from '@/lib/supabase';
import { formatearMoneda, obtenerAñoActual } from '@/lib/utils';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Target } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-slate-100">
      {/* Header Premium */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-slate-700/30 backdrop-blur-lg bg-slate-900/40 px-8 py-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end gap-4 mb-3">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
            >
              Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-300 font-light"
            >
              Financiero
            </motion.p>
          </div>
          <p className="text-slate-400 text-lg">Control total de flujos y conceptos financieros</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Year Selector Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-12 bg-gradient-to-r from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold uppercase tracking-widest text-sm">Período</span>
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAño(año - 1)}
                className="p-3 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 hover:border-blue-400/60 rounded-lg transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-blue-400" />
              </motion.button>
              <span className="text-5xl font-bold w-32 text-center text-cyan-400 tracking-tight">{año}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAño(año + 1)}
                className="p-3 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 hover:border-blue-400/60 rounded-lg transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5 text-blue-400" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Ingresos Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -8, shadow: "0 20px 40px rgba(0,0,0,0.5)" }}
            className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-400/30 rounded-2xl p-8 backdrop-blur-xl hover:border-emerald-400/60 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-8">
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 bg-emerald-500/20 rounded-xl"
              >
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </motion.div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400/70">Ingresos</span>
            </div>
            <h2 className="text-4xl font-bold text-emerald-400 mb-2">
              {loading ? '...' : formatearMoneda(totalIngresos)}
            </h2>
            <p className="text-sm text-slate-400">Total de ingresos registrados</p>
          </motion.div>

          {/* Egresos Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ y: -8, shadow: "0 20px 40px rgba(0,0,0,0.5)" }}
            className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-400/30 rounded-2xl p-8 backdrop-blur-xl hover:border-red-400/60 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-8">
              <motion.div
                animate={{ rotate: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 bg-red-500/20 rounded-xl"
              >
                <TrendingDown className="w-6 h-6 text-red-400" />
              </motion.div>
              <span className="text-xs font-bold uppercase tracking-widest text-red-400/70">Egresos</span>
            </div>
            <h2 className="text-4xl font-bold text-red-400 mb-2">
              {loading ? '...' : formatearMoneda(totalEgresos)}
            </h2>
            <p className="text-sm text-slate-400">Total de egresos registrados</p>
          </motion.div>

          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -8, shadow: "0 20px 40px rgba(0,0,0,0.5)" }}
            className={`bg-gradient-to-br ${balance >= 0 ? 'from-cyan-500/10 to-cyan-600/5' : 'from-amber-500/10 to-amber-600/5'} border ${balance >= 0 ? 'border-cyan-400/30' : 'border-amber-400/30'} rounded-2xl p-8 backdrop-blur-xl ${balance >= 0 ? 'hover:border-cyan-400/60' : 'hover:border-amber-400/60'} transition-all duration-300 cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`p-3 rounded-xl ${balance >= 0 ? 'bg-cyan-500/20' : 'bg-amber-500/20'}`}
              >
                <Target className={`w-6 h-6 ${balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`} />
              </motion.div>
              <span className={`text-xs font-bold uppercase tracking-widest ${balance >= 0 ? 'text-cyan-400/70' : 'text-amber-400/70'}`}>Balance</span>
            </div>
            <h2 className={`text-4xl font-bold mb-2 ${balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
              {loading ? '...' : formatearMoneda(balance)}
            </h2>
            <p className="text-sm text-slate-400">{balance >= 0 ? 'Situación positiva' : 'Situación negativa'}</p>
          </motion.div>
        </div>

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-100 mb-2">Desglose por Concepto</h3>
            <p className="text-slate-400 text-sm">Análisis detallado de tus transacciones financieras</p>
          </div>

          <div className="bg-gradient-to-b from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-xl">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50">
                  <th className="px-8 py-6 text-left text-xs font-bold uppercase tracking-widest text-slate-300">Concepto</th>
                  <th className="px-8 py-6 text-right text-xs font-bold uppercase tracking-widest text-emerald-400">Ingresos</th>
                  <th className="px-8 py-6 text-right text-xs font-bold uppercase tracking-widest text-red-400">Egresos</th>
                  <th className="px-8 py-6 text-right text-xs font-bold uppercase tracking-widest text-cyan-400">Balance</th>
                  <th className="px-8 py-6 text-right text-xs font-bold uppercase tracking-widest text-slate-300">Proporción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-slate-400">
                        Cargando datos...
                      </motion.div>
                    </td>
                  </tr>
                ) : conceptos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <p className="text-slate-400 font-medium">Sin datos registrados</p>
                      <p className="text-slate-500 text-sm mt-2">Comienza a registrar tus transacciones</p>
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
                        className="hover:bg-slate-700/20 transition-colors duration-150"
                      >
                        <td className="px-8 py-5 font-semibold text-slate-100">{concepto.concepto}</td>
                        <td className="px-8 py-5 text-right font-bold text-emerald-400">
                          {formatearMoneda(concepto.ingresos)}
                        </td>
                        <td className="px-8 py-5 text-right font-bold text-red-400">
                          {formatearMoneda(concepto.egresos)}
                        </td>
                        <td className={`px-8 py-5 text-right font-bold ${concepto.balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
                          {formatearMoneda(concepto.balance)}
                        </td>
                        <td className="px-8 py-5 text-right text-slate-300 font-semibold">
                          {totalIngresos > 0 ? ((concepto.ingresos / totalIngresos) * 100).toFixed(1) : '0'}%
                        </td>
                      </motion.tr>
                    ))}
                    {conceptos.length > 0 && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gradient-to-r from-slate-700/30 to-slate-800/30 border-t-2 border-slate-600/50"
                      >
                        <td className="px-8 py-6 font-bold text-slate-100">TOTAL</td>
                        <td className="px-8 py-6 text-right text-emerald-400 font-bold text-lg">
                          {formatearMoneda(totalIngresos)}
                        </td>
                        <td className="px-8 py-6 text-right text-red-400 font-bold text-lg">
                          {formatearMoneda(totalEgresos)}
                        </td>
                        <td className={`px-8 py-6 text-right font-bold text-lg ${balance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
                          {formatearMoneda(balance)}
                        </td>
                        <td className="px-8 py-6 text-right text-slate-300 font-bold text-lg">100%</td>
                      </motion.tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between items-center mt-12 pt-8 border-t border-slate-700/30"
        >
          <div>
            <p className="text-slate-400 text-sm font-medium">Período fiscal: <span className="text-cyan-400 font-bold">{año}</span></p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-xs">Actualizado automáticamente</p>
            <p className="text-slate-600 text-xs mt-1">Dashboard v2.0</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
