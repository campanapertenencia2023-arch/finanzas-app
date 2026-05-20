'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 font-montserrat">Finanzas</h1>
          <p className="text-slate-600 mb-6">Solo acceso para usuarios preestablecidos</p>

          <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-4 rounded-lg mb-8">
            <p className="font-semibold mb-3 text-blue-600">Usuarios disponibles:</p>
            <p className="mb-2">Usuario: <strong>julian</strong></p>
            <p className="mb-3">Contraseña: <strong>paola123</strong></p>
            <div className="border-t border-blue-200 my-3"></div>
            <p className="mb-2">Usuario: <strong>paola</strong></p>
            <p>Contraseña: <strong>julian123</strong></p>
          </div>

          <Link
            href="/auth/login"
            className="w-full block text-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
