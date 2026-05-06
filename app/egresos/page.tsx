'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getEgresos, getConceptosEgresos, crearEgreso, eliminarEgreso } from '@/lib/supabase';
import { formatearMoneda, getNombreMes, obtenerAñoActual, obtenerMesActual } from '@/lib/utils';
import type { ConceptoEgreso } from '@/lib/types';

export default function EgresosPage() {
  const { usuario, loading: authLoading } = useAuth();
  const [egresos, setEgresos] = useState<any[]>([]);
  const [conceptos, setConceptos] = useState<ConceptoEgreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState(obtenerMesActual());
  const [año, setAño] = useState(obtenerAñoActual());
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    concepto_id: '',
    monto: '',
    descripcion: '',
  });

  useEffect(() => {
    if (!authLoading && usuario) {
      cargarDatos();
    } else if (!authLoading && !usuario) {
      setLoading(false);
    }
  }, [mes, año, usuario, authLoading]);

  async function cargarDatos() {
    if (!usuario) return;
    try {
      const [egr, conc] = await Promise.all([
        getEgresos(usuario.id, mes, año),
        getConceptosEgresos(usuario.id),
      ]);
      setEgresos(egr);
      setConceptos(conc);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCrearEgreso(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!formData.concepto_id) {
      setFormError('Selecciona un concepto');
      return;
    }
    if (!formData.monto) {
      setFormError('Ingresa un monto');
      return;
    }
    if (!usuario) {
      setFormError('Usuario no autenticado');
      return;
    }

    setFormLoading(true);
    try {
      await crearEgreso(
        usuario.id,
        mes,
        año,
        parseInt(formData.concepto_id),
        parseFloat(formData.monto),
        formData.descripcion
      );
      setFormData({ concepto_id: '', monto: '', descripcion: '' });
      setFormError('');
      await cargarDatos();
    } catch (error: any) {
      const errorMsg = error?.message || 'Error al crear egreso';
      setFormError(errorMsg);
      console.error('Error al crear egreso:', error);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleEliminar(id: number) {
    if (confirm('¿Eliminar este egreso?')) {
      try {
        await eliminarEgreso(id);
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  }

  const totalMes = egresos.reduce((sum, e) => sum + parseFloat(e.monto), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestión de Egresos</h1>

        {/* Selector de mes/año */}
        <div className="mb-8 flex gap-4">
          <select
            value={mes}
            onChange={(e) => setMes(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{getNombreMes(m)}</option>
            ))}
          </select>
          <select
            value={año}
            onChange={(e) => setAño(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg"
          >
            {Array.from({ length: 5 }, (_, i) => año - 2 + i).map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Registrar Egreso</h2>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {formError}
            </div>
          )}
          <form onSubmit={handleCrearEgreso} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={formData.concepto_id}
              onChange={(e) => setFormData({ ...formData, concepto_id: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              disabled={formLoading}
            >
              <option value="">Selecciona concepto</option>
              {conceptos.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Monto"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              step="0.01"
              disabled={formLoading}
            />
            <input
              type="text"
              placeholder="Descripción (opcional)"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              disabled={formLoading}
            />
            <button
              type="submit"
              disabled={formLoading}
              className="px-6 py-2 bg-[#4a6fa5] text-white rounded-lg hover:bg-[#3d5a7f] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {formLoading ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
        </div>

        {/* Resumen */}
        <div className="bg-red-50 rounded-lg shadow p-4 mb-8 border-l-4 border-red-600">
          <p className="text-lg font-semibold text-gray-800">
            Total {getNombreMes(mes)}: <span className="text-2xl text-red-600">{formatearMoneda(totalMes)}</span>
          </p>
        </div>

        {/* Tabla de egresos */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Concepto</th>
                <th className="px-6 py-3 text-left font-semibold">Monto</th>
                <th className="px-6 py-3 text-left font-semibold">Descripción</th>
                <th className="px-6 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {egresos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No hay egresos registrados
                  </td>
                </tr>
              ) : (
                egresos.map(egreso => (
                  <tr key={egreso.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{egreso.conceptos_egresos.nombre}</td>
                    <td className="px-6 py-4 font-semibold text-red-600">
                      {formatearMoneda(egreso.monto)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {egreso.descripcion || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEliminar(egreso.id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
