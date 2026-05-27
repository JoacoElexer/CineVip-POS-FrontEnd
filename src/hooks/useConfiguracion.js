import { useState, useCallback, useEffect } from 'react';
import * as promocionesService from '../services/promociones.js';

const PAGO_KEY = 'pos_cine_metodos_pago';
const PROMO_KEY = 'pos_cine_promociones_cache';

function loadCache(key) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : []; } catch { return []; }
}
function saveCache(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

export function useMetodosPago() {
  const [metodos, setMetodos] = useState(() => loadCache(PAGO_KEY));

  const agregar = useCallback((m) => {
    const nuevo = { ...m, id_pago: 'pago_' + Date.now() };
    setMetodos(prev => { const u = [...prev, nuevo]; saveCache(PAGO_KEY, u); return u; });
    return nuevo;
  }, []);

  const actualizar = useCallback((id, data) => {
    setMetodos(prev => { const u = prev.map(m => m.id_pago === id ? { ...m, ...data } : m); saveCache(PAGO_KEY, u); return u; });
  }, []);

  const eliminar = useCallback((id) => {
    setMetodos(prev => { const u = prev.filter(m => m.id_pago !== id); saveCache(PAGO_KEY, u); return u; });
  }, []);

  return { metodos, agregar, actualizar, eliminar };
}

export function usePromociones() {
  const [promociones, setPromociones] = useState(() => loadCache(PROMO_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    promocionesService.getPromociones()
      .then(res => { if (ignore) return; const data = Array.isArray(res.data) ? res.data : []; setPromociones(data); saveCache(PROMO_KEY, data); setError(null); })
      .catch(() => { if (ignore) return; const c = loadCache(PROMO_KEY); if (c.length) setPromociones(c); setError('Error al conectar. Usando datos locales.'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const recargar = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await promocionesService.getPromociones();
      const data = Array.isArray(res.data) ? res.data : [];
      setPromociones(data); saveCache(PROMO_KEY, data);
    } catch {
      const c = loadCache(PROMO_KEY);
      if (c.length) setPromociones(c);
      setError('Error al conectar. Usando datos locales.');
    } finally { setLoading(false); }
  }, []);

  const agregar = useCallback(async (p) => {
    try {
      const res = await promocionesService.createPromocion(p);
      const nueva = res.data;
      setPromociones(prev => { const u = [...prev, nueva]; saveCache(PROMO_KEY, u); return u; });
      return nueva;
    } catch {
      const nueva = { ...p, id_promo: 'temp_' + Date.now() };
      setPromociones(prev => { const u = [...prev, nueva]; saveCache(PROMO_KEY, u); return u; });
      return nueva;
    }
  }, []);

  const actualizar = useCallback(async (id, data) => {
    try {
      const res = await promocionesService.updatePromocion(id, data);
      const actualizada = res.data;
      setPromociones(prev => { const u = prev.map(p => p.id_promo === id ? actualizada : p); saveCache(PROMO_KEY, u); return u; });
    } catch {
      setPromociones(prev => { const u = prev.map(p => p.id_promo === id ? { ...p, ...data } : p); saveCache(PROMO_KEY, u); return u; });
    }
  }, []);

  const eliminar = useCallback(async (id) => {
    try { await promocionesService.deletePromocion(id); } catch { /* silent */ }
    setPromociones(prev => { const u = prev.filter(p => p.id_promo !== id); saveCache(PROMO_KEY, u); return u; });
  }, []);

  return { promociones, loading, error, agregar, actualizar, eliminar, recargar };
}
