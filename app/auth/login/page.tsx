'use client';

import { useState } from 'react';
import { login } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { LoadingState } from '@/components/ui/LoadingState';

export default function LoginPage() {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(nombre, password);
      // Redirect al dashboard
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card variant="premium">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-slate-900 mb-2 font-montserrat">
              💰 Finanzas
            </h1>
            <p className="text-slate-600">Inicia sesión en tu cuenta</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm font-semibold">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <FormInput
              label="Usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <FormInput
              label="Contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center text-slate-600 text-sm">
            <p>Usuarios de prueba: <span className="text-blue-600 font-semibold">julian</span> o <span className="text-blue-600 font-semibold">paola</span></p>
          </div>
        </Card>
      </div>
    </div>
  );
}
