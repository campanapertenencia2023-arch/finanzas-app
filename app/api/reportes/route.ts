import { getResumenPorConcepto } from '@/lib/google-sheets';
import { NextRequest, NextResponse } from 'next/server';
import type { ReporteAnalytics, ApiResponse, ApiError } from '@/lib/types';

// GET: Obtener reportes y analytics
export async function GET(request: NextRequest) {
  try {
    const usuario = request.nextUrl.searchParams.get('usuario');
    const año = request.nextUrl.searchParams.get('año');

    if (!usuario || !año) {
      return NextResponse.json<ApiError>(
        { error: 'usuario y año son requeridos' },
        { status: 400 }
      );
    }

    const resumen = await getResumenPorConcepto(usuario, parseInt(año));

    const totalIngresos = resumen.reduce((sum, r) => sum + r.ingresos, 0);
    const totalEgresos = resumen.reduce((sum, r) => sum + r.egresos, 0);
    const balance = totalIngresos - totalEgresos;

    // Obtener top conceptos
    const conceptosMasAltos = resumen
      .filter((r) => r.ingresos > 0 || r.egresos > 0)
      .map((r) => ({
        concepto: r.concepto,
        monto: r.ingresos > 0 ? r.ingresos : r.egresos,
        porcentaje:
          r.ingresos > 0
            ? (r.ingresos / totalIngresos) * 100
            : (r.egresos / totalEgresos) * 100,
      }))
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 5);

    const analytics: ReporteAnalytics = {
      totalIngresos,
      totalEgresos,
      balance,
      conceptosMasAltos,
      evolucion: [], // Se puede implementar si se necesita evolución mensual
    };

    return NextResponse.json<ApiResponse<ReporteAnalytics>>({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Error en GET /api/reportes:', error);
    return NextResponse.json<ApiError>(
      { error: 'Error al obtener reportes', details: String(error) },
      { status: 500 }
    );
  }
}
