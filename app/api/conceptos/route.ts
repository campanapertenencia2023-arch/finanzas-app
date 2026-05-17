import { getConceptos, agregarConcepto } from '@/lib/google-sheets';
import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, ApiError } from '@/lib/types';

// GET: Obtener conceptos para un usuario
export async function GET(request: NextRequest) {
  try {
    const usuario = request.nextUrl.searchParams.get('usuario');
    const tipo = request.nextUrl.searchParams.get('tipo') as 'ingreso' | 'egreso' | null;

    if (!usuario || !tipo) {
      return NextResponse.json<ApiError>(
        { error: 'usuario y tipo (ingreso|egreso) son requeridos' },
        { status: 400 }
      );
    }

    const conceptos = await getConceptos(usuario, tipo);

    return NextResponse.json<ApiResponse<string[]>>({
      success: true,
      data: conceptos,
    });
  } catch (error) {
    console.error('Error en GET /api/conceptos:', error);
    return NextResponse.json<ApiError>(
      { error: 'Error al obtener conceptos', details: String(error) },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo concepto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { usuario, tipo, concepto, descripcion } = body;

    if (!usuario || !tipo || !concepto) {
      return NextResponse.json<ApiError>(
        { error: 'Campos requeridos: usuario, tipo, concepto' },
        { status: 400 }
      );
    }

    if (tipo !== 'ingreso' && tipo !== 'egreso') {
      return NextResponse.json<ApiError>(
        { error: 'tipo debe ser "ingreso" o "egreso"' },
        { status: 400 }
      );
    }

    await agregarConcepto(usuario, tipo, concepto, descripcion || '');

    return NextResponse.json<ApiResponse<{ success: true }>>(
      { success: true, data: { success: true } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en POST /api/conceptos:', error);
    return NextResponse.json<ApiError>(
      { error: 'Error al crear concepto', details: String(error) },
      { status: 500 }
    );
  }
}
