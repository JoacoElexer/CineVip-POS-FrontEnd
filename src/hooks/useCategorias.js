import { useState, useCallback } from 'react';

const CAT_KEY = 'pos_cine_categorias';
const INV_KEY = 'pos_cine_inventario';

let nextId = Date.now();

function load(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useCategorias() {
  const [categorias, setCategorias] = useState(() => load(CAT_KEY));

  const agregar = useCallback((cat) => {
    const nueva = { ...cat, id_categoria: nextId++ };
    setCategorias(prev => {
      const updated = [...prev, nueva];
      save(CAT_KEY, updated);
      return updated;
    });
    return nueva;
  }, []);

  const actualizar = useCallback((id, data) => {
    setCategorias(prev => {
      const updated = prev.map(c => c.id_categoria === id ? { ...c, ...data } : c);
      save(CAT_KEY, updated);
      return updated;
    });
  }, []);

  const eliminar = useCallback((id) => {
    setCategorias(prev => {
      const updated = prev.filter(c => c.id_categoria !== id);
      save(CAT_KEY, updated);
      return updated;
    });
  }, []);

  return { categorias, agregar, actualizar, eliminar };
}

export function useInventario() {
  const [inventario, setInventario] = useState(() => load(INV_KEY));

  const upsert = useCallback((entry) => {
    setInventario(prev => {
      const idx = prev.findIndex(e => e.id_producto === entry.id_producto);
      let updated;
      if (idx >= 0) {
        updated = prev.map((e, i) => i === idx ? { ...e, ...entry } : e);
      } else {
        updated = [...prev, { ...entry, id_inventario: nextId++ }];
      }
      save(INV_KEY, updated);
      return updated;
    });
  }, []);

  const eliminar = useCallback((id) => {
    setInventario(prev => {
      const updated = prev.filter(e => e.id_inventario !== id);
      save(INV_KEY, updated);
      return updated;
    });
  }, []);

  const getByProducto = useCallback((id) => inventario.find(e => e.id_producto === id),
    [inventario]);

  return { inventario, upsert, eliminar, getByProducto };
}
