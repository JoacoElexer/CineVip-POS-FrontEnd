import { useState, useCallback } from 'react';

const STORAGE_KEY = 'pos_cine_productos';

function loadProductos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveProductos(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let nextId = Date.now();

export function useProductos() {
  const [productos, setProductos] = useState(loadProductos);

  const agregar = useCallback((producto) => {
    const nuevo = { ...producto, id_producto: nextId++ };
    setProductos(prev => {
      const updated = [...prev, nuevo];
      saveProductos(updated);
      return updated;
    });
    return nuevo;
  }, []);

  const actualizar = useCallback((id, data) => {
    setProductos(prev => {
      const updated = prev.map(p => p.id_producto === id ? { ...p, ...data } : p);
      saveProductos(updated);
      return updated;
    });
  }, []);

  const eliminar = useCallback((id) => {
    setProductos(prev => {
      const updated = prev.filter(p => p.id_producto !== id);
      saveProductos(updated);
      return updated;
    });
  }, []);

  const getById = useCallback((id) => productos.find(p => p.id_producto === id),
    [productos]);

  return { productos, agregar, actualizar, eliminar, getById };
}
