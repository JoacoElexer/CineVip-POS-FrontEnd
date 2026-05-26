import { useState, useCallback } from 'react';

const KEY = 'pos_cine_ventas';
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

export function useVentas() {
  const [ventas, setVentas] = useState(load);

  const registrarVenta = useCallback((venta) => {
    const nueva = { ...venta, id_venta: nextId++, fecha: new Date().toISOString() };
    setVentas(prev => {
      const updated = [...prev, nueva];
      save(updated);
      return updated;
    });
    return nueva;
  }, []);

  const eliminarVenta = useCallback((id) => {
    setVentas(prev => {
      const updated = prev.filter(v => v.id_venta !== id);
      save(updated);
      return updated;
    });
  }, []);

  const getVentasPorFecha = useCallback((fecha) => {
    if (!fecha) return ventas;
    return ventas.filter(v => v.fecha && v.fecha.startsWith(fecha));
  }, [ventas]);

  return { ventas, registrarVenta, eliminarVenta, getVentasPorFecha };
}
