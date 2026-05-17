import { getResumenPorConcepto } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

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

    const resumen = await getResumenPorConcepto(parseInt(usuario), año ? parseInt(año) : undefined);

    return NextResponse.json(resumen);
  } catch (error) {
    console.error('Error en GET /api/resumen:', error);
    return NextResponse.json(
      { error: 'Error al obtener resumen', details: String(error) },
      { status: 500 }
    );
  }
}
