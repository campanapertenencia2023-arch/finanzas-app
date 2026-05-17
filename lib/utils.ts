export function getNombreMes(mes: number): string {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[mes - 1];
}

export function formatearMoneda(monto: number, moneda: string = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
  }).format(monto);
}

export function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-CO');
}

export function obtenerAñoActual(): number {
  return new Date().getFullYear();
}

export function obtenerMesActual(): number {
  return new Date().getMonth() + 1;
}
