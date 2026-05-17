'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4e4f7] to-[#fafafa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Finanzas</h1>
          <p className="text-gray-600 mb-6">Solo hay acceso para usuarios preestablecidos</p>

          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-8">
            <p className="font-semibold mb-3">Usuarios disponibles:</p>
            <p className="mb-2">👤 Usuario: <strong>julian</strong></p>
            <p className="mb-2">🔑 Contraseña: <strong>julian123</strong></p>
            <hr className="my-3" />
            <p className="mb-2">👤 Usuario: <strong>paola</strong></p>
            <p>🔑 Contraseña: <strong>paola123</strong></p>
          </div>

          <Link
            href="/auth/login"
            className="w-full block text-center px-6 py-3 bg-[#4a6fa5] text-white rounded-lg hover:bg-[#3d5a7f] font-semibold"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
