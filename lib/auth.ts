import type { UsuarioLogueado } from './types';

const STORAGE_KEY = 'usuario_actual';

export async function login(nombre: string, password: string): Promise<UsuarioLogueado> {
  // Validar usuario contra Google Sheets via API
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Usuario o contraseña incorrectos');
  }

  const usuario = await response.json();

  // Guardar en localStorage
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
