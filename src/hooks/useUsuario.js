import { useState, useCallback } from 'react';

const KEY = 'pos_cine_usuarios';

function load() {
  try {
    const data = localStorage.getItem(KEY);
    const parsed = data ? JSON.parse(data) : null;
    return parsed || { id_usuario: 1, nombre: 'Operador', email: 'operador@cinevip.com', rol: 'Admin', ultimo_acceso: new Date().toLocaleDateString('es-MX') };
  } catch {
    return { id_usuario: 1, nombre: 'Operador', email: 'operador@cinevip.com', rol: 'Admin', ultimo_acceso: new Date().toLocaleDateString('es-MX') };
  }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function useUsuario() {
  const [usuario, setUsuario] = useState(load);

  const actualizar = useCallback((data) => {
    setUsuario(prev => {
      const updated = { ...prev, ...data };
      save(updated);
      return updated;
    });
  }, []);

  return { usuario, actualizar };
}
