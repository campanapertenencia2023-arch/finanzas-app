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
  id: number;
  nombre: string;
};

export type ResumenConcepto = {
  concepto: string;
  ingresos: number;
  egresos: number;
  balance: number;
};

export type ConceptoTopAnalytics = {
  concepto: string;
  monto: number;
  porcentaje: number;
};

export type ReporteAnalytics = {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  conceptosMasAltos: ConceptoTopAnalytics[];
  evolucion?: Array<{
    mes: number;
    ingresos: number;
    egresos: number;
    balance: number;
  }>;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type ApiError = {
  error: string;
  details?: string;
};
