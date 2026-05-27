import { useState, useCallback, useEffect } from 'react';
import * as productosService from '../services/productos.js';

const CACHE_KEY = 'pos_cine_productos_cache';

function normalize(p) {
  return { ...p, id_producto: p.id_producto ?? p.id ?? p._id, id_categoria: p.id_categoria ?? p.categoria_id,     precio: Number(p.precio ?? p.precio_unitario) || 0 };
}

function toBackend(p) {
  const data = { ...p };
  data.categoria_id = data.id_categoria;
  data.precio_unitario = data.precio;
  delete data.id_categoria;
  delete data.precio;
  return data;
}

function loadCache() {
  try { const d = localStorage.getItem(CACHE_KEY); return d ? JSON.parse(d) : []; } catch { return []; }
}
function saveCache(data) { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); }

export function useProductos() {
  const [productos, setProductos] = useState(loadCache);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    productosService.getProductos()
      .then(res => { if (ignore) return; const data = Array.isArray(res.data) ? res.data : []; const normalized = data.map(normalize); setProductos(normalized); saveCache(normalized); setError(null); })
      .catch(() => { if (ignore) return; const c = loadCache(); if (c.length) setProductos(c); setError('Error al conectar. Usando datos locales.'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const recargar = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await productosService.getProductos();
      const data = Array.isArray(res.data) ? res.data : [];
      const normalized = data.map(normalize);
      setProductos(normalized); saveCache(normalized);
    } catch {
      const c = loadCache();
      if (c.length) setProductos(c);
      setError('Error al conectar. Usando datos locales.');
    } finally { setLoading(false); }
  }, []);

  const agregar = useCallback(async (p) => {
    try {
      const res = await productosService.createProducto(toBackend(p));
      const nuevo = normalize(res.data);
      setProductos(prev => { const u = [...prev, nuevo]; saveCache(u); return u; });
      return nuevo;
    } catch {
      const nuevo = { ...p, id_producto: 'temp_' + Date.now() };
      setProductos(prev => { const u = [...prev, nuevo]; saveCache(u); return u; });
      return nuevo;
    }
  }, []);

  const actualizar = useCallback(async (id, data) => {
    try {
      const res = await productosService.updateProducto(id, toBackend(data));
      const actualizado = normalize(res.data);
      setProductos(prev => { const u = prev.map(p => p.id_producto === id ? actualizado : p); saveCache(u); return u; });
    } catch {
      setProductos(prev => { const u = prev.map(p => p.id_producto === id ? { ...p, ...data } : p); saveCache(u); return u; });
    }
  }, []);

  const eliminar = useCallback(async (id) => {
    try { await productosService.deleteProducto(id); } catch { /* silent */ }
    setProductos(prev => { const u = prev.filter(p => p.id_producto !== id); saveCache(u); return u; });
  }, []);

  const getById = useCallback((id) => productos.find(p => p.id_producto === id), [productos]);

  return { productos, loading, error, agregar, actualizar, eliminar, getById, recargar };
}
