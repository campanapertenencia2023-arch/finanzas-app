'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  getConceptosIngresos,
  getConceptosEgresos,
  crearConceptoIngreso,
  crearConceptoEgreso,
  eliminarConceptoIngreso,
  eliminarConceptoEgreso,
} from '@/lib/supabase';
import type { ConceptoIngreso, ConceptoEgreso } from '@/lib/types';

export default function ConceptosPage() {
  const { usuario, loading: authLoading } = useAuth();
  const [conceptosIngresos, setConceptosIngresos] = useState<ConceptoIngreso[]>([]);
  const [conceptosEgresos, setConceptosEgresos] = useState<ConceptoEgreso[]>([]);
  const [loading, setLoading] = useState(true);

  const [formIngreso, setFormIngreso] = useState({
    nombre: '',
    descripcion: '',
  });

  const [formEgreso, setFormEgreso] = useState({
    nombre: '',
    descripcion: '',
  });

  useEffect(() => {
    if (!authLoading && usuario) {
      cargarDatos();
    } else if (!authLoading && !usuario) {
      setLoading(false);
    }
  }, [usuario, authLoading]);

  async function cargarDatos() {
    if (!usuario) return;
    try {
      const [ci, ce] = await Promise.all([
        getConceptosIngresos(usuario.id),
        getConceptosEgresos(usuario.id),
      ]);
      setConceptosIngresos(ci);
      setConceptosEgresos(ce);
    } catch (error) {
      console.error('Error al cargar conceptos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCrearConceptoIngreso(e: React.FormEvent) {
    e.preventDefault();
    if (!formIngreso.nombre || !usuario) return;

    try {
      await crearConceptoIngreso(usuario.id, formIngreso.nombre, formIngreso.descripcion);
      setFormIngreso({ nombre: '', descripcion: '' });
      cargarDatos();
    } catch (error) {
      console.error('Error al crear concepto:', error);
    }
  }

  async function handleCrearConceptoEgreso(e: React.FormEvent) {
    e.preventDefault();
    if (!formEgreso.nombre || !usuario) return;

    try {
      await crearConceptoEgreso(usuario.id, formEgreso.nombre, formEgreso.descripcion);
      setFormEgreso({ nombre: '', descripcion: '' });
      cargarDatos();
    } catch (error) {
      console.error('Error al crear concepto:', error);
    }
  }

  async function handleEliminarIngreso(id: number) {
    if (confirm('¿Eliminar este concepto?')) {
      try {
        await eliminarConceptoIngreso(id);
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  }

  async function handleEliminarEgreso(id: number) {
    if (confirm('¿Eliminar este concepto?')) {
      try {
        await eliminarConceptoEgreso(id);
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestión de Conceptos</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conceptos de Ingresos */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Conceptos de Ingresos</h2>
              <form onSubmit={handleCrearConceptoIngreso} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre del concepto"
                  value={formIngreso.nombre}
                  onChange={(e) => setFormIngreso({ ...formIngreso, nombre: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="Descripción (opcional)"
                  value={formIngreso.descripcion}
                  onChange={(e) => setFormIngreso({ ...formIngreso, descripcion: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg resize-none"
                  rows={3}
                />
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-[#4a6fa5] text-white rounded-lg hover:bg-[#3d5a7f]"
                >
                  Crear Concepto
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-green-100 px-6 py-3">
                <h3 className="font-semibold text-green-800">
                  Lista de Conceptos ({conceptosIngresos.length})
                </h3>
              </div>
              <ul className="divide-y">
                {conceptosIngresos.length === 0 ? (
                  <li className="px-6 py-4 text-gray-500 text-center">
                    No hay conceptos registrados
                  </li>
                ) : (
                  conceptosIngresos.map(concepto => (
                    <li
                      key={concepto.id}
                      className="px-6 py-4 flex justify-between items-start hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{concepto.nombre}</p>
                        {concepto.descripcion && (
                          <p className="text-sm text-gray-600 mt-1">{concepto.descripcion}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleEliminarIngreso(concepto.id)}
                        className="ml-4 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Conceptos de Egresos */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Conceptos de Egresos</h2>
              <form onSubmit={handleCrearConceptoEgreso} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre del concepto"
                  value={formEgreso.nombre}
                  onChange={(e) => setFormEgreso({ ...formEgreso, nombre: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="Descripción (opcional)"
                  value={formEgreso.descripcion}
                  onChange={(e) => setFormEgreso({ ...formEgreso, descripcion: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg resize-none"
                  rows={3}
                />
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-[#4a6fa5] text-white rounded-lg hover:bg-[#3d5a7f]"
                >
                  Crear Concepto
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-red-100 px-6 py-3">
                <h3 className="font-semibold text-red-800">
                  Lista de Conceptos ({conceptosEgresos.length})
                </h3>
              </div>
              <ul className="divide-y">
                {conceptosEgresos.length === 0 ? (
                  <li className="px-6 py-4 text-gray-500 text-center">
                    No hay conceptos registrados
                  </li>
                ) : (
                  conceptosEgresos.map(concepto => (
                    <li
                      key={concepto.id}
                      className="px-6 py-4 flex justify-between items-start hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{concepto.nombre}</p>
                        {concepto.descripcion && (
                          <p className="text-sm text-gray-600 mt-1">{concepto.descripcion}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleEliminarEgreso(concepto.id)}
                        className="ml-4 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
