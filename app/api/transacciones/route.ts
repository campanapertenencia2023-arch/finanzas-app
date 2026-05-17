import { agregarTransaccion, obtenerTransacciones } from '@/lib/google-sheets';
import { NextRequest, NextResponse } from 'next/server';
import type { Transaccion, ApiResponse, ApiError } from '@/lib/types';

// GET: Obtener transacciones filtradas
export async function GET(request: NextRequest) {
  try {
    const usuario = request.nextUrl.searchParams.get('usuario');
    const año = request.nextUrl.searchParams.get('año');
    const tipo = request.nextUrl.searchParams.get('tipo') as 'ingreso' | 'egreso' | null;

    if (!usuario || !año) {
      return NextResponse.json<ApiError>(
        { error: 'usuario y año son requeridos' },
        { status: 400 }
      );
    }

    const transacciones = await obtenerTransacciones(usuario, parseInt(año), tipo || undefined);

    return NextResponse.json<ApiResponse<Transaccion[]>>({
      success: true,
      data: transacciones,
    });
  } catch (error) {
    console.error('Error en GET /api/transacciones:', error);
    return NextResponse.json<ApiError>(
      { error: 'Error al obtener transacciones', details: String(error) },
      { status: 500 }
    );
  }
}

// POST: Crear nueva transacción
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Transaccion;

    if (!body.usuario || !body.tipo || !body.fecha || !body.concepto || !body.monto || !body.año) {
      return NextResponse.json<ApiError>(
        { error: 'Campos requeridos: usuario, tipo, fecha, concepto, monto, año' },
        { status: 400 }
      );
    }

    await agregarTransaccion(body);

    return NextResponse.json<ApiResponse<{ success: true }>>(
      { success: true, data: { success: true } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en POST /api/transacciones:', error);
    return NextResponse.json<ApiError>(
      { error: 'Error al crear transacción', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar transacción (nota: Google Sheets no soporta fácilmente delete, esto es placeholder)
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiError>(
        { error: 'id es requerido' },
        { status: 400 }
      );
    }

    // Nota: Google Sheets no tiene un método directo para eliminar filas específicas
    // Este es un placeholder que necesitaría implementación custom si es necesario
    return NextResponse.json<ApiError>(
      { error: 'Eliminar transacciones aún no está implementado' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error en DELETE /api/transacciones:', error);
    return NextResponse.json<ApiError>(
      { error: 'Error al eliminar transacción', details: String(error) },
      { status: 500 }
    );
  }
}
