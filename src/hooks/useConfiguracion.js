import { useState, useCallback } from 'react';

const PAGO_KEY = 'pos_cine_metodos_pago';
const PROMO_KEY = 'pos_cine_promociones';

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

export function useMetodosPago() {
  const [metodos, setMetodos] = useState(() => load(PAGO_KEY));

  const agregar = useCallback((m) => {
    const nuevo = { ...m, id_pago: nextId++ };
    setMetodos(prev => {
      const updated = [...prev, nuevo];
      save(PAGO_KEY, updated);
      return updated;
    });
    return nuevo;
  }, []);

  const actualizar = useCallback((id, data) => {
    setMetodos(prev => {
      const updated = prev.map(m => m.id_pago === id ? { ...m, ...data } : m);
      save(PAGO_KEY, updated);
      return updated;
    });
  }, []);

  const eliminar = useCallback((id) => {
    setMetodos(prev => {
      const updated = prev.filter(m => m.id_pago !== id);
      save(PAGO_KEY, updated);
      return updated;
    });
  }, []);

  return { metodos, agregar, actualizar, eliminar };
}

export function usePromociones() {
  const [promociones, setPromociones] = useState(() => load(PROMO_KEY));

  const agregar = useCallback((p) => {
    const nueva = { ...p, id_promo: nextId++ };
    setPromociones(prev => {
      const updated = [...prev, nueva];
      save(PROMO_KEY, updated);
      return updated;
    });
    return nueva;
  }, []);

  const actualizar = useCallback((id, data) => {
    setPromociones(prev => {
      const updated = prev.map(p => p.id_promo === id ? { ...p, ...data } : p);
      save(PROMO_KEY, updated);
      return updated;
    });
  }, []);

  const eliminar = useCallback((id) => {
    setPromociones(prev => {
      const updated = prev.filter(p => p.id_promo !== id);
      save(PROMO_KEY, updated);
      return updated;
    });
  }, []);

  return { promociones, agregar, actualizar, eliminar };
}
