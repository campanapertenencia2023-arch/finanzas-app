'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getUsuarioActual, onUsuarioChange } from './auth';
import type { UsuarioLogueado } from './types';

type AuthContextType = {
  usuario: UsuarioLogueado | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogueado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener usuario actual al montar
    const usuarioActual = getUsuarioActual();
    setUsuario(usuarioActual);
    setLoading(false);

    // Escuchar cambios en otras pestañas
    const unsubscribe = onUsuarioChange((newUsuario) => {
      setUsuario(newUsuario);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
