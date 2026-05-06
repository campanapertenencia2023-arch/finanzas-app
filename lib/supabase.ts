import { createClient } from '@supabase/supabase-js';
import type { ConceptoIngreso, ConceptoEgreso, Ingreso, Egreso } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Conceptos de Ingresos
export async function getConceptosIngresos(userId: number) {
  const { data, error } = await supabase
    .from('conceptos_ingresos')
    .select('*')
    .eq('user_id', userId)
    .order('nombre');

  if (error) throw error;
  return data as ConceptoIngreso[];
}

export async function crearConceptoIngreso(userId: number, nombre: string, descripcion?: string) {
  const { data, error } = await supabase
    .from('conceptos_ingresos')
    .insert([{ user_id: userId, nombre, descripcion }])
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
export async function getConceptosEgresos(userId: number) {
  const { data, error } = await supabase
    .from('conceptos_egresos')
    .select('*')
    .eq('user_id', userId)
    .order('nombre');

  if (error) throw error;
  return data as ConceptoEgreso[];
}

export async function crearConceptoEgreso(userId: number, nombre: string, descripcion?: string) {
  const { data, error } = await supabase
    .from('conceptos_egresos')
    .insert([{ user_id: userId, nombre, descripcion }])
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
export async function getIngresos(userId: number, mes?: number, año?: number) {
  let query = supabase
    .from('ingresos')
    .select('*, conceptos_ingresos(*)')
    .eq('user_id', userId);

  if (mes) query = query.eq('mes', mes);
  if (año) query = query.eq('año', año);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as any[];
}

export async function crearIngreso(
  userId: number,
  mes: number,
  año: number,
  concepto_id: number,
  monto: number,
  descripcion?: string
) {
  const { data, error } = await supabase
    .from('ingresos')
    .insert([{ user_id: userId, mes, año, concepto_id, monto, descripcion }])
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
export async function getEgresos(userId: number, mes?: number, año?: number) {
  let query = supabase
    .from('egresos')
    .select('*, conceptos_egresos(*)')
    .eq('user_id', userId);

  if (mes) query = query.eq('mes', mes);
  if (año) query = query.eq('año', año);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as any[];
}

export async function crearEgreso(
  userId: number,
  mes: number,
  año: number,
  concepto_id: number,
  monto: number,
  descripcion?: string
) {
  const { data, error } = await supabase
    .from('egresos')
    .insert([{ user_id: userId, mes, año, concepto_id, monto, descripcion }])
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
export async function getResumenMensual(userId: number, año: number) {
  const { data: ingresos, error: ingresoError } = await supabase
    .from('ingresos')
    .select('mes, monto')
    .eq('user_id', userId)
    .eq('año', año);

  const { data: egresos, error: egresoError } = await supabase
    .from('egresos')
    .select('mes, monto')
    .eq('user_id', userId)
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

export async function getResumenPorConcepto(userId: number, año?: number) {
  // Ingresos por concepto
  let queryIngresos = supabase
    .from('ingresos')
    .select('monto, conceptos_ingresos(nombre)')
    .eq('user_id', userId);

  if (año) queryIngresos = queryIngresos.eq('año', año);

  const { data: ingresosData, error: ingresoError } = await queryIngresos;

  // Egresos por concepto
  let queryEgresos = supabase
    .from('egresos')
    .select('monto, conceptos_egresos(nombre)')
    .eq('user_id', userId);

  if (año) queryEgresos = queryEgresos.eq('año', año);

  const { data: egresosData, error: egresoError } = await queryEgresos;

  if (ingresoError || egresoError) throw new Error('Error fetching data');

  // Agrupar ingresos por concepto
  const ingresosMap = new Map<string, number>();
  (ingresosData || []).forEach(item => {
    const nombre = item.conceptos_ingresos?.nombre || 'Sin concepto';
    const monto = parseFloat(item.monto);
    ingresosMap.set(nombre, (ingresosMap.get(nombre) || 0) + monto);
  });

  // Agrupar egresos por concepto
  const egresosMap = new Map<string, number>();
  (egresosData || []).forEach(item => {
    const nombre = item.conceptos_egresos?.nombre || 'Sin concepto';
    const monto = parseFloat(item.monto);
    egresosMap.set(nombre, (egresosMap.get(nombre) || 0) + monto);
  });

  // Combinar en un resumen
  const conceptos = new Set([...ingresosMap.keys(), ...egresosMap.keys()]);

  return Array.from(conceptos).map(concepto => ({
    concepto,
    ingresos: ingresosMap.get(concepto) || 0,
    egresos: egresosMap.get(concepto) || 0,
    balance: (ingresosMap.get(concepto) || 0) - (egresosMap.get(concepto) || 0),
  }));
}
