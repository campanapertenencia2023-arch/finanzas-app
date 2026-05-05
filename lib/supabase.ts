import { createClient } from '@supabase/supabase-js';
import type { ConceptoIngreso, ConceptoEgreso, Ingreso, Egreso } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Conceptos de Ingresos
export async function getConceptosIngresos() {
  const { data, error } = await supabase
    .from('conceptos_ingresos')
    .select('*')
    .order('nombre');

  if (error) throw error;
  return data as ConceptoIngreso[];
}

export async function crearConceptoIngreso(nombre: string, descripcion?: string) {
  const { data, error } = await supabase
    .from('conceptos_ingresos')
    .insert([{ nombre, descripcion }])
    .select();

  if (error) throw error;
  return data[0] as ConceptoIngreso;
}

export async function eliminarConceptoIngreso(id: number) {
  const { error } = await supabase
    .from('conceptos_ingresos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Conceptos de Egresos
export async function getConceptosEgresos() {
  const { data, error } = await supabase
    .from('conceptos_egresos')
    .select('*')
    .order('nombre');

  if (error) throw error;
  return data as ConceptoEgreso[];
}

export async function crearConceptoEgreso(nombre: string, descripcion?: string) {
  const { data, error } = await supabase
    .from('conceptos_egresos')
    .insert([{ nombre, descripcion }])
    .select();

  if (error) throw error;
  return data[0] as ConceptoEgreso;
}

export async function eliminarConceptoEgreso(id: number) {
  const { error } = await supabase
    .from('conceptos_egresos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Ingresos
export async function getIngresos(mes?: number, año?: number) {
  let query = supabase
    .from('ingresos')
    .select('*, conceptos_ingresos(*)');

  if (mes) query = query.eq('mes', mes);
  if (año) query = query.eq('año', año);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as any[];
}

export async function crearIngreso(
  mes: number,
  año: number,
  concepto_id: number,
  monto: number,
  descripcion?: string
) {
  const { data, error } = await supabase
    .from('ingresos')
    .insert([{ mes, año, concepto_id, monto, descripcion }])
    .select('*, conceptos_ingresos(*)');

  if (error) throw error;
  return data[0];
}

export async function actualizarIngreso(
  id: number,
  updates: Partial<Ingreso>
) {
  const { data, error } = await supabase
    .from('ingresos')
    .update(updates)
    .eq('id', id)
    .select('*, conceptos_ingresos(*)');

  if (error) throw error;
  return data[0];
}

export async function eliminarIngreso(id: number) {
  const { error } = await supabase
    .from('ingresos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Egresos
export async function getEgresos(mes?: number, año?: number) {
  let query = supabase
    .from('egresos')
    .select('*, conceptos_egresos(*)');

  if (mes) query = query.eq('mes', mes);
  if (año) query = query.eq('año', año);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as any[];
}

export async function crearEgreso(
  mes: number,
  año: number,
  concepto_id: number,
  monto: number,
  descripcion?: string
) {
  const { data, error } = await supabase
    .from('egresos')
    .insert([{ mes, año, concepto_id, monto, descripcion }])
    .select('*, conceptos_egresos(*)');

  if (error) throw error;
  return data[0];
}

export async function actualizarEgreso(
  id: number,
  updates: Partial<Egreso>
) {
  const { data, error } = await supabase
    .from('egresos')
    .update(updates)
    .eq('id', id)
    .select('*, conceptos_egresos(*)');

  if (error) throw error;
  return data[0];
}

export async function eliminarEgreso(id: number) {
  const { error } = await supabase
    .from('egresos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Queries analíticas
export async function getResumenMensual(año: number) {
  const { data: ingresos, error: ingresoError } = await supabase
    .from('ingresos')
    .select('mes, monto')
    .eq('año', año);

  const { data: egresos, error: egresoError } = await supabase
    .from('egresos')
    .select('mes, monto')
    .eq('año', año);

  if (ingresoError || egresoError) throw new Error('Error fetching data');

  const meses = Array.from({ length: 12 }, (_, i) => i + 1);

  return meses.map(mes => {
    const totalIngresos = (ingresos || [])
      .filter(i => i.mes === mes)
      .reduce((sum, i) => sum + parseFloat(i.monto), 0);

    const totalEgresos = (egresos || [])
      .filter(e => e.mes === mes)
      .reduce((sum, e) => sum + parseFloat(e.monto), 0);

    return {
      mes,
      totalIngresos,
      totalEgresos,
      balance: totalIngresos - totalEgresos,
    };
  });
}
