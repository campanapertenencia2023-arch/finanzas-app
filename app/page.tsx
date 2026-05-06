'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getResumenMensual } from '@/lib/supabase';
import { getNombreMes, formatearMoneda, obtenerAñoActual } from '@/lib/utils';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { usuario, loading: authLoading } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [año, setAño] = useState(obtenerAñoActual());

  const formatTooltip = (value: any) => {
    if (typeof value === 'number') {
      return formatearMoneda(value);
    }
    return value;
  };

  useEffect(() => {
    async function cargarDatos() {
      if (!usuario) return;
      try {
        const resumen = await getResumenMensual(usuario.id, año);
        setData(resumen);
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

  const totalIngresos = data.reduce((sum, d) => sum + d.totalIngresos, 0);
  const totalEgresos = data.reduce((sum, d) => sum + d.totalEgresos, 0);
  const balance = totalIngresos - totalEgresos;

  const chartData = data.map(d => ({
    ...d,
    mes: getNombreMes(d.mes),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4e4f7] to-[#fafafa] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard Financiero</h1>

        {/* Selector de año */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setAño(año - 1)}
            className="px-4 py-2 bg-[#4a6fa5] text-white rounded-lg hover:bg-[#3d5a7f]"
          >
            ← Año anterior
          </button>
          <span className="text-2xl font-bold text-gray-800 px-6 py-2 bg-white rounded-lg shadow">
            {año}
          </span>
          <button
            onClick={() => setAño(año + 1)}
            className="px-4 py-2 bg-[#4a6fa5] text-white rounded-lg hover:bg-[#3d5a7f]"
          >
            Año siguiente →
          </button>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Ingresos</h3>
            <p className="text-3xl font-bold text-green-600">
              {loading ? 'Cargando...' : formatearMoneda(totalIngresos)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Egresos</h3>
            <p className="text-3xl font-bold text-red-600">
              {loading ? 'Cargando...' : formatearMoneda(totalEgresos)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">Balance</h3>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {loading ? 'Cargando...' : formatearMoneda(balance)}
            </p>
          </div>
        </div>

        {/* Gráficos */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gráfico de barras */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ingresos vs Egresos</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={formatTooltip} />
                  <Legend />
                  <Bar dataKey="totalIngresos" fill="#10b981" name="Ingresos" />
                  <Bar dataKey="totalEgresos" fill="#ef4444" name="Egresos" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de línea */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Balance Mensual</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={formatTooltip} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#3b82f6"
                    name="Balance"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
