import { supabase } from './supabase';
import type { UsuarioLogueado } from './types';

const STORAGE_KEY = 'usuario_actual';

export async function login(nombre: string, password: string): Promise<UsuarioLogueado> {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nombre, password')
    .eq('nombre', nombre)
    .single();

  if (error || !data) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  // Verificar contraseña (en un app real, usar bcrypt)
  if (data.password !== password) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  // Guardar en localStorage
  const usuario: UsuarioLogueado = { id: data.id, nombre: data.nombre };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));

  return usuario;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getUsuarioActual(): UsuarioLogueado | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function onUsuarioChange(callback: (usuario: UsuarioLogueado | null) => void): () => void {
  // Ejecutar inmediatamente
  callback(getUsuarioActual());

  // Escuchar cambios en localStorage
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(e.newValue ? JSON.parse(e.newValue) : null);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }

  return () => {};
}
