'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { formatearMoneda, obtenerAñoActual } from '@/lib/utils';
import type { Transaccion, ResumenConcepto } from '@/lib/types';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function IngresosPage() {
  const { usuario, loading: authLoading } = useAuth();
  const [año, setAño] = useState(obtenerAñoActual());
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [resumen, setResumen] = useState<ResumenConcepto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [conceptos, setConceptos] = useState<string[]>([]);
  const [newConcepto, setNewConcepto] = useState('');

  const [formData, setFormData] = useState({
    concepto: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!authLoading && usuario) {
      cargarDatos();
      cargarConceptos();
    }
  }, [año, usuario, authLoading]);

  async function cargarDatos() {
    setLoading(true);
    try {
      const response = await fetch(`/api/transacciones?usuario=${usuario?.id}&año=${año}&tipo=ingreso`);
      if (!response.ok) throw new Error('Error al cargar datos');
      const data = await response.json();
      setTransacciones(data.data || []);

      const resResponse = await fetch(`/api/resumen?usuario=${usuario?.id}&año=${año}`);
      if (!resResponse.ok) throw new Error('Error al cargar resumen');
      const resData = await resResponse.json();
      setResumen(resData.filter((r: any) => r.ingresos > 0) || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function cargarConceptos() {
    try {
      const response = await fetch(`/api/conceptos?usuario=${usuario?.id}&tipo=ingreso`);
      if (!response.ok) throw new Error('Error al cargar conceptos');
      const data = await response.json();
      setConceptos(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function handleCrearIngreso(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario || !formData.concepto || !formData.monto) return;

    try {
      const response = await fetch('/api/transacciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: usuario.id,
          tipo: 'ingreso',
          fecha: formData.fecha,
          concepto: formData.concepto,
          monto: parseFloat(formData.monto),
          año,
        }),
      });

      if (!response.ok) throw new Error('Error al crear ingreso');
      setFormData({ concepto: '', monto: '', fecha: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function handleCrearConcepto(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario || !newConcepto) return;

    try {
      const response = await fetch('/api/conceptos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: usuario.id,
          tipo: 'ingreso',
          concepto: newConcepto,
        }),
      });

      if (!response.ok) throw new Error('Error al crear concepto');
      setNewConcepto('');
      cargarConceptos();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const totalIngresos = resumen.reduce((sum, r) => sum + r.ingresos, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-5xl font-bold text-slate-900 font-montserrat">Ingresos</h1>
            <Button variant="success" size="md" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2 inline" /> Nuevo Ingreso
            </Button>
          </div>
          <p className="text-slate-600">Gestiona tus ingresos y categorías</p>
        </div>

        {/* Year Selector */}
        <Card variant="premium" className="mb-8">
          <div className="flex items-center justify-between">
            <span className="text-slate-700 font-semibold uppercase text-sm">Período</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setAño(año - 1)} className="p-2 hover:bg-slate-100 rounded-lg transition">
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
              <span className="text-4xl font-bold w-20 text-center text-blue-600 font-montserrat">{año}</span>
              <button onClick={() => setAño(año + 1)} className="p-2 hover:bg-slate-100 rounded-lg transition">
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>
        </Card>

        {/* Total Income Card */}
        <Card variant="premium" className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 uppercase text-sm font-bold mb-2 font-montserrat">Total Ingresos</p>
              <h2 className="text-4xl font-bold text-emerald-600 font-montserrat">{formatearMoneda(totalIngresos)}</h2>
            </div>
            <Badge variant="income">{transacciones.length} operaciones</Badge>
          </div>
        </Card>

        {/* Form Section */}
        {showForm && (
          <Card variant="default" className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 font-montserrat">Nuevo Ingreso</h3>
            <form onSubmit={handleCrearIngreso} className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Concepto</label>
                  <select
                    value={formData.concepto}
                    onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                    required
                  >
                    <option value="">Selecciona un concepto</option>
                    {conceptos.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <FormInput
                  label="Monto"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                  required
                />
              </div>
              <FormInput
                label="Fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
              <Button type="submit" variant="success" size="lg">
                Crear Ingreso
              </Button>
            </form>

            <h3 className="text-2xl font-bold text-slate-900 mb-4 pt-6 border-t border-slate-200 font-montserrat">Nuevo Concepto</h3>
            <form onSubmit={handleCrearConcepto} className="flex gap-2">
              <input
                type="text"
                placeholder="Nombre del concepto"
                value={newConcepto}
                onChange={(e) => setNewConcepto(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                required
              />
              <Button type="submit" variant="secondary">
                Agregar
              </Button>
            </form>
          </Card>
        )}

        {/* Table */}
        <Card variant="default">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 font-montserrat">Transacciones</h3>
          {loading ? (
            <LoadingState variant="skeleton" />
          ) : transacciones.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No hay ingresos registrados</p>
          ) : (
            <Table
              columns={[
                { key: 'fecha', label: 'Fecha', align: 'left' },
                { key: 'concepto', label: 'Concepto', align: 'left' },
                { key: 'monto', label: 'Monto', align: 'right', render: (v) => formatearMoneda(v) },
              ]}
              data={transacciones}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
