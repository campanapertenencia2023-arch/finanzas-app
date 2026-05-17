export type ConceptoIngreso = {
  id: number;
  nombre: string;
  descripcion: string | null;
  created_at: string;
};

export type ConceptoEgreso = {
  id: number;
  nombre: string;
  descripcion: string | null;
  created_at: string;
};

export type Ingreso = {
  id: number;
  mes: number;
  año: number;
  concepto_id: number;
  monto: number;
  descripcion: string | null;
  created_at: string;
};

export type Egreso = {
  id: number;
  mes: number;
  año: number;
  concepto_id: number;
  monto: number;
  descripcion: string | null;
  created_at: string;
};

export type IngresoConConcepto = Ingreso & {
  conceptos_ingresos: ConceptoIngreso;
};

export type EgresoConConcepto = Egreso & {
  conceptos_egresos: ConceptoEgreso;
};

export type ResumenMensual = {
  mes: number;
  año: number;
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
};

export type ResumenPorConcepto = {
  concepto: string;
  monto: number;
};

export type Usuario = {
  id: number;
  nombre: string;
  password: string;
};

export type UsuarioLogueado = {
  id: string | number;
  nombre: string;
};

// === TIPOS MEJORADOS PARA GOOGLE SHEETS ===

export type Transaccion = {
  usuario: string;
  tipo: 'ingreso' | 'egreso';
  fecha: string;
  concepto: string;
  monto: number;
  año: number;
};

export type ResumenConcepto = {
  concepto: string;
  ingresos: number;
  egresos: number;
  balance: number;
};

export type Concepto = {
  usuario: string;
  tipo: 'ingreso' | 'egreso';
  nombre: string;
  descripcion?: string;
};

// === TIPOS PARA API RESPONSES ===

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: string;
}

export type TransaccionRow = [string, string, string, string, string | number, number]; // Usuario, Tipo, Fecha, Concepto, Monto, Año
export type ConceptoRow = [string, string, string, string]; // Usuario, Tipo, Concepto, Descripción
export type UsuarioRow = [string, string, string]; // Usuario, Password, Descripción

// === ESTADO DE APLICACIÓN ===

export interface AppState {
  usuario: UsuarioLogueado | null;
  loading: boolean;
  error: string | null;
}

export interface DataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  lastFetched?: Date;
}

// === FILTROS Y PARÁMETROS ===

export interface FiltrosTransacciones {
  usuario?: string;
  año?: number;
  mes?: number;
  tipo?: 'ingreso' | 'egreso';
  concepto?: string;
}

export interface RangoFechas {
  desde: string; // YYYY-MM-DD
  hasta: string; // YYYY-MM-DD
}

// === REPORTES ===

export interface ReporteAnalytics {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  conceptosMasAltos: Array<{
    concepto: string;
    monto: number;
    porcentaje: number;
  }>;
  evolucion: Array<{
    fecha: string;
    ingresos: number;
    egresos: number;
    balance: number;
  }>;
}
