import { validarUsuario } from '@/lib/google-sheets';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, password } = body;

    if (!nombre || !password) {
      return NextResponse.json(
        { error: 'nombre y password son requeridos' },
        { status: 400 }
      );
    }

    const usuario = await validarUsuario(nombre, password);

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Error en API auth/login:', error);
    return NextResponse.json(
      { error: 'Error al autenticar usuario' },
      { status: 500 }
    );
  }
}
