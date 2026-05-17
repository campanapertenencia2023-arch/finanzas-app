import { getResumenPorConcepto } from '@/lib/google-sheets';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const usuario = request.nextUrl.searchParams.get('usuario');
    const año = request.nextUrl.searchParams.get('año');

    if (!usuario || !año) {
      return NextResponse.json(
        { error: 'usuario y año son requeridos' },
        { status: 400 }
      );
    }

    const resumen = await getResumenPorConcepto(usuario, parseInt(año));
    return NextResponse.json(resumen);
  } catch (error) {
    console.error('Error en API resumen:', error);
    return NextResponse.json(
      { error: 'Error al obtener resumen' },
      { status: 500 }
    );
  }
}
