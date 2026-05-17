import { getResumenPorConcepto } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import type { ReporteAnalytics, ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const usuario = request.nextUrl.searchParams.get('usuario');
    const año = request.nextUrl.searchParams.get('año');

    if (!usuario) {
      return NextResponse.json(
        { error: 'usuario es requerido' },
        { status: 400 }
      );
    }

    const resumenPorConcepto = await getResumenPorConcepto(
      parseInt(usuario),
      año ? parseInt(año) : undefined
    );

    const totalIngresos = resumenPorConcepto.reduce((sum, c: any) => sum + c.ingresos, 0);
    const totalEgresos = resumenPorConcepto.reduce((sum, c: any) => sum + c.egresos, 0);
    const balance = totalIngresos - totalEgresos;

    // Combinar ingresos y egresos para obtener el monto total por concepto
    const conceptosMontosMap = new Map<string, number>();
    resumenPorConcepto.forEach((c: any) => {
      const monto = c.ingresos + c.egresos;
      conceptosMontosMap.set(c.concepto, monto);
    });

    // Obtener top 5 conceptos por monto
    const conceptosMasAltos = Array.from(conceptosMontosMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([concepto, monto]) => ({
        concepto,
        monto,
        porcentaje: ((monto / (totalIngresos + totalEgresos)) * 100) || 0,
      }));

    const reporte: ReporteAnalytics = {
      totalIngresos,
      totalEgresos,
      balance,
      conceptosMasAltos,
      evolucion: [], // TODO: implementar evolución mensual
    };

    return NextResponse.json<ApiResponse<ReporteAnalytics>>({
      success: true,
      data: reporte,
    });
  } catch (error) {
    console.error('Error en GET /api/reportes:', error);
    return NextResponse.json(
      { error: 'Error al obtener reportes', details: String(error) },
      { status: 500 }
    );
  }
}
