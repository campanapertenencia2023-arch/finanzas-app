'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { Plus } from 'lucide-react';

export default function ConceptosPage() {
  const { usuario, loading: authLoading } = useAuth();
  const [conceptosIngresos, setConceptosIngresos] = useState<string[]>([]);
  const [conceptosEgresos, setConceptosEgresos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newConceptoIngreso, setNewConceptoIngreso] = useState('');
  const [newConceptoEgreso, setNewConceptoEgreso] = useState('');

  useEffect(() => {
    if (!authLoading && usuario) {
      cargarConceptos();
    }
  }, [usuario, authLoading]);

  async function cargarConceptos() {
    setLoading(true);
    try {
      const [ingresoRes, egresoRes] = await Promise.all([
        fetch(`/api/conceptos?usuario=${usuario?.id}&tipo=ingreso`),
        fetch(`/api/conceptos?usuario=${usuario?.id}&tipo=egreso`),
      ]);

      if (!ingresoRes.ok || !egresoRes.ok) throw new Error('Error al cargar conceptos');

      const ingresoData = await ingresoRes.json();
      const egresoData = await egresoRes.json();

      setConceptosIngresos(ingresoData.data || []);
      setConceptosEgresos(egresoData.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCrearConcepto(tipo: 'ingreso' | 'egreso', concepto: string) {
    if (!usuario || !concepto) return;

    try {
      const response = await fetch('/api/conceptos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: usuario.id,
          tipo,
          concepto,
        }),
      });

      if (!response.ok) throw new Error('Error al crear concepto');

      if (tipo === 'ingreso') {
        setNewConceptoIngreso('');
      } else {
        setNewConceptoEgreso('');
      }

      cargarConceptos();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="min-h-screen from-white to-slate-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8 mb-8">
          <h1 className="text-5xl font-bold font-montserrat bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            🏷️ Conceptos
          </h1>
          <p className="text-slate-600">Gestiona las categorías de tus transacciones</p>
        </div>

        {loading ? (
          <LoadingState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Conceptos de Ingresos */}
            <Card variant="premium" className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold font-montserrat text-emerald-600">Ingresos</h2>
                  <Badge variant="income">{conceptosIngresos.length}</Badge>
                </div>
                <p className="text-emerald-600 text-sm">Categorías de ingreso</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCrearConcepto('ingreso', newConceptoIngreso);
                }}
                className="mb-6 pb-6 border-b border-slate-200 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Nuevo concepto"
                  value={newConceptoIngreso}
                  onChange={(e) => setNewConceptoIngreso(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-500"
                  required
                />
                <Button type="submit" variant="success" size="md">
                  <Plus className="w-4 h-4" />
                </Button>
              </form>

              <div className="space-y-2">
                {conceptosIngresos.length === 0 ? (
                  <p className="text-slate-600 text-sm">Sin conceptos aún</p>
                ) : (
                  conceptosIngresos.map((concepto) => (
                    <div key={concepto} className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-600 font-semibold">
                      {concepto}
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Conceptos de Egresos */}
            <Card variant="premium" className="bg-gradient-to-br from-red-500/10 to-red-600/5">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold font-montserrat text-red-400">Egresos</h2>
                  <Badge variant="expense">{conceptosEgresos.length}</Badge>
                </div>
                <p className="text-red-400/70 text-sm">Categorías de egreso</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCrearConcepto('egreso', newConceptoEgreso);
                }}
                className="mb-6 pb-6 border-b border-slate-200 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Nuevo concepto"
                  value={newConceptoEgreso}
                  onChange={(e) => setNewConceptoEgreso(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-500"
                  required
                />
                <Button type="submit" variant="danger" size="md">
                  <Plus className="w-4 h-4" />
                </Button>
              </form>

              <div className="space-y-2">
                {conceptosEgresos.length === 0 ? (
                  <p className="text-slate-600 text-sm">Sin conceptos aún</p>
                ) : (
                  conceptosEgresos.map((concepto) => (
                    <div key={concepto} className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 font-semibold">
                      {concepto}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
