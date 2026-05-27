import { useState, useCallback, useEffect } from 'react';
import * as ventasService from '../services/ventas.js';

const CACHE_KEY = 'pos_cine_ventas_cache';

function normalize(v) {
  return {
    ...v,
    id_venta: v.id_venta ?? v.id ?? v._id,
    id_usuario: v.id_usuario ?? v.id_empleado ?? v.empleado_id,
    fecha: v.fecha ?? v.fecha_transaccion,
    total: Number(v.total ?? v.total_pagado) || 0,
    subtotal: Number(v.subtotal) || 0,
    propina: Number(v.propina) || 0,
  };
}

function getUsuarioId() {
  try {
    const data = localStorage.getItem('pos_cine_usuarios');
    if (data) { const u = JSON.parse(data); return u.id_usuario || null; }
  } catch { /* ignore */ }
  return null;
}

function toBackend(v) {
  const data = { ...v };
  data.empleado_id = data.empleado_id ?? data.id_usuario ?? getUsuarioId();
  data.total_pagado = data.total_pagado ?? data.total;
  data.metodo_pago = data.metodo_pago || 'Efectivo';
  data.subtotal = data.subtotal ?? data.total;
  delete data.id_usuario;
  delete data.total;
  delete data.items;
  delete data.asientos;
  delete data.tipo;
  delete data.pelicula;
  delete data.id_funcion;
  delete data.propina_porcentaje;
  return data;
}

function loadCache() {
  try { const d = localStorage.getItem(CACHE_KEY); return d ? JSON.parse(d) : []; } catch { return []; }
}
function saveCache(data) { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); }

export function useVentas() {
  const [ventas, setVentas] = useState(loadCache);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    ventasService.getVentas()
      .then(res => { if (ignore) return; const data = Array.isArray(res.data) ? res.data : []; const normalized = data.map(normalize); setVentas(normalized); saveCache(normalized); setError(null); })
      .catch(() => { if (ignore) return; const c = loadCache(); if (c.length) setVentas(c); setError('Error al conectar. Usando datos locales.'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const recargar = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await ventasService.getVentas();
      const data = Array.isArray(res.data) ? res.data : [];
      const normalized = data.map(normalize);
      setVentas(normalized); saveCache(normalized);
    } catch {
      const c = loadCache();
      if (c.length) setVentas(c);
      setError('Error al conectar. Usando datos locales.');
    } finally { setLoading(false); }
  }, []);

  const registrarVenta = useCallback(async (venta) => {
    const nueva = { ...venta, fecha: venta.fecha || new Date().toISOString() };
    try {
      const res = await ventasService.createVenta(toBackend(nueva));
      const registrada = normalize(res.data);
      setVentas(prev => { const u = [...prev, registrada]; saveCache(u); return u; });
      return registrada;
    } catch {
      const fallback = { ...nueva, id_venta: 'temp_' + Date.now() };
      setVentas(prev => { const u = [...prev, fallback]; saveCache(u); return u; });
      return fallback;
    }
  }, []);

  const eliminarVenta = useCallback(async (id) => {
    try { await ventasService.deleteVenta(id); } catch { /* silent */ }
    setVentas(prev => { const u = prev.filter(v => v.id_venta !== id); saveCache(u); return u; });
  }, []);

  const getVentasPorFecha = useCallback((fecha) => {
    if (!fecha) return ventas;
    return ventas.filter(v => v.fecha && v.fecha.startsWith(fecha));
  }, [ventas]);

  return { ventas, loading, error, registrarVenta, eliminarVenta, getVentasPorFecha, recargar };
}
