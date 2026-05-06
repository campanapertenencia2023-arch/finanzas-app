'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getResumenPorConcepto } from '@/lib/supabase';
import { formatearMoneda, obtenerAñoActual } from '@/lib/utils';

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

        {/* Resumen por concepto */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#4a6fa5] to-[#3d5a7f] px-6 py-4">
            <h2 className="text-xl font-bold text-white">Resumen por Concepto - Año {año}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Concepto</th>
                  <th className="px-6 py-4 text-right font-semibold text-green-600">Ingresos</th>
                  <th className="px-6 py-4 text-right font-semibold text-red-600">Egresos</th>
                  <th className="px-6 py-4 text-right font-semibold text-blue-600">Balance</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      Cargando...
                    </td>
                  </tr>
                ) : conceptos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No hay datos disponibles
                    </td>
                  </tr>
                ) : (
                  conceptos.map((concepto, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-800">{concepto.concepto}</td>
                      <td className="px-6 py-4 text-right font-semibold text-green-600">
                        {formatearMoneda(concepto.ingresos)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-red-600">
                        {formatearMoneda(concepto.egresos)}
                      </td>
                      <td className={`px-6 py-4 text-right font-semibold ${concepto.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatearMoneda(concepto.balance)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {!loading && conceptos.length > 0 && (
                <tfoot className="bg-gray-50 border-t-2">
                  <tr>
                    <td className="px-6 py-4 font-bold text-gray-800">TOTAL</td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">
                      {formatearMoneda(totalIngresos)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-red-600">
                      {formatearMoneda(totalEgresos)}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatearMoneda(balance)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
