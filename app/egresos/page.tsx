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

export default function EgresosPage() {
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
    descripcion: '',
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
      const response = await fetch(`/api/transacciones?usuario=${usuario?.id}&año=${año}&tipo=egreso`);
      if (!response.ok) throw new Error('Error al cargar datos');
      const data = await response.json();
      setTransacciones(data.data || []);

      const resResponse = await fetch(`/api/resumen?usuario=${usuario?.id}&año=${año}`);
      if (!resResponse.ok) throw new Error('Error al cargar resumen');
      const resData = await resResponse.json();
      setResumen(resData.filter((r: any) => r.egresos > 0) || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function cargarConceptos() {
    try {
      const response = await fetch(`/api/conceptos?usuario=${usuario?.id}&tipo=egreso`);
      if (!response.ok) throw new Error('Error al cargar conceptos');
      const data = await response.json();
      setConceptos(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function handleCrearEgreso(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario || !formData.concepto || !formData.monto) return;

    try {
      const response = await fetch('/api/transacciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: usuario.id,
          tipo: 'egreso',
          fecha: formData.fecha,
          concepto: formData.concepto,
          monto: parseFloat(formData.monto),
          año,
        }),
      });

      if (!response.ok) throw new Error('Error al crear egreso');
      setFormData({ concepto: '', monto: '', fecha: new Date().toISOString().split('T')[0], descripcion: '' });
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
          tipo: 'egreso',
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

  const totalEgresos = resumen.reduce((sum, r) => sum + r.egresos, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-slate-700/30 pb-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              💸 Egresos
            </h1>
            <Button variant="danger" size="md" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2 inline" /> Nuevo Egreso
            </Button>
          </div>
          <p className="text-slate-400">Gestiona tus gastos y categorías</p>
        </div>

        {/* Year Selector */}
        <Card variant="premium" className="mb-8">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-semibold uppercase">Período</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setAño(año - 1)} className="p-2 hover:bg-slate-700/40 rounded-lg transition">
                <ChevronLeft className="w-5 h-5 text-red-400" />
              </button>
              <span className="text-4xl font-bold w-20 text-center text-red-400">{año}</span>
              <button onClick={() => setAño(año + 1)} className="p-2 hover:bg-slate-700/40 rounded-lg transition">
                <ChevronRight className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>
        </Card>

        {/* Total Expenses Card */}
        <Card variant="premium" className="mb-8 bg-gradient-to-br from-red-500/10 to-red-600/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400/70 uppercase text-sm font-bold mb-2">Total Egresos</p>
              <h2 className="text-4xl font-bold text-red-400">{formatearMoneda(totalEgresos)}</h2>
            </div>
            <Badge variant="expense">{transacciones.length} operaciones</Badge>
          </div>
        </Card>

        {/* Form Section */}
        {showForm && (
          <Card variant="default" className="mb-8">
            <h3 className="text-xl font-bold text-slate-100 mb-6">Nuevo Egreso</h3>
            <form onSubmit={handleCrearEgreso} className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Concepto</label>
                  <select
                    value={formData.concepto}
                    onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 focus:outline-none focus:border-blue-500/50"
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
              <Button type="submit" variant="danger" size="lg">
                Crear Egreso
              </Button>
            </form>

            <h3 className="text-xl font-bold text-slate-100 mb-4 pt-6 border-t border-slate-700/30">Nuevo Concepto</h3>
            <form onSubmit={handleCrearConcepto} className="flex gap-2">
              <input
                type="text"
                placeholder="Nombre del concepto"
                value={newConcepto}
                onChange={(e) => setNewConcepto(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100"
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
          <h3 className="text-xl font-bold text-slate-100 mb-6">Transacciones</h3>
          {loading ? (
            <LoadingState variant="skeleton" />
          ) : transacciones.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No hay egresos registrados</p>
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
