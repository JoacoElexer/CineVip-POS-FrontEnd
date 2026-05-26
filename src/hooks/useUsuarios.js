import { useState, useCallback } from 'react';

const KEY = 'pos_cine_usuarios_lista';

let nextId = Date.now();

function load() {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState(load);

  const agregar = useCallback((usr) => {
    const nuevo = { ...usr, id_usuario: nextId++ };
    setUsuarios(prev => {
      const updated = [...prev, nuevo];
      save(updated);
      return updated;
    });
    return nuevo;
  }, []);

  const actualizar = useCallback((id, data) => {
    setUsuarios(prev => {
      const updated = prev.map(u => u.id_usuario === id ? { ...u, ...data } : u);
      save(updated);
      return updated;
    });
  }, []);

  const eliminar = useCallback((id) => {
    setUsuarios(prev => {
      const updated = prev.filter(u => u.id_usuario !== id);
      save(updated);
      return updated;
    });
  }, []);

  return { usuarios, agregar, actualizar, eliminar };
}
