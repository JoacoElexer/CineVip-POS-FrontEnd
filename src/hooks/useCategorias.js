import { useState, useCallback, useEffect } from 'react';
import * as categoriasService from '../services/categorias.js';

const CAT_KEY = 'pos_cine_categorias_cache';
const INV_KEY = 'pos_cine_inventario';

function loadCache(key) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : []; } catch { return []; }
}
function saveCache(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

export function useCategorias() {
  const [categorias, setCategorias] = useState(() => loadCache(CAT_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    categoriasService.getCategorias()
      .then(res => { if (ignore) return; const data = Array.isArray(res.data) ? res.data : []; const norm = data.map(c => ({ ...c, id_categoria: c.id_categoria ?? c.id })); setCategorias(norm); saveCache(CAT_KEY, norm); setError(null); })
      .catch(() => { if (ignore) return; const c = loadCache(CAT_KEY); if (c.length) setCategorias(c); setError('Error al conectar. Usando datos locales.'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const recargar = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await categoriasService.getCategorias();
      const data = Array.isArray(res.data) ? res.data : [];
      const norm = data.map(c => ({ ...c, id_categoria: c.id_categoria ?? c.id }));
      setCategorias(norm); saveCache(CAT_KEY, norm);
    } catch {
      const c = loadCache(CAT_KEY);
      if (c.length) setCategorias(c);
      setError('Error al conectar. Usando datos locales.');
    } finally { setLoading(false); }
  }, []);

  const agregar = useCallback(async (cat) => {
    try {
      const res = await categoriasService.createCategoria(cat);
      const nueva = res.data;
      setCategorias(prev => { const u = [...prev, nueva]; saveCache(CAT_KEY, u); return u; });
      return nueva;
    } catch {
      const nueva = { ...cat, id_categoria: 'temp_' + Date.now() };
      setCategorias(prev => { const u = [...prev, nueva]; saveCache(CAT_KEY, u); return u; });
      return nueva;
    }
  }, []);

  const actualizar = useCallback(async (id, data) => {
    try {
      const res = await categoriasService.updateCategoria(id, data);
      const actualizada = res.data;
      setCategorias(prev => { const u = prev.map(c => c.id_categoria === id ? actualizada : c); saveCache(CAT_KEY, u); return u; });
    } catch {
      setCategorias(prev => { const u = prev.map(c => c.id_categoria === id ? { ...c, ...data } : c); saveCache(CAT_KEY, u); return u; });
    }
  }, []);

  const eliminar = useCallback(async (id) => {
    try { await categoriasService.deleteCategoria(id); } catch { /* silent */ }
    setCategorias(prev => { const u = prev.filter(c => c.id_categoria !== id); saveCache(CAT_KEY, u); return u; });
  }, []);

  return { categorias, loading, error, agregar, actualizar, eliminar, recargar };
}

export function useInventario() {
  const [inventario, setInventario] = useState(() => loadCache(INV_KEY));

  const upsert = useCallback((entry) => {
    setInventario(prev => {
      const idx = prev.findIndex(e => e.id_producto === entry.id_producto);
      let updated;
      if (idx >= 0) {
        updated = prev.map((e, i) => i === idx ? { ...e, ...entry } : e);
      } else {
        updated = [...prev, { ...entry, id_inventario: Date.now() }];
      }
      saveCache(INV_KEY, updated);
      return updated;
    });
  }, []);

  const eliminar = useCallback((id) => {
    setInventario(prev => {
      const updated = prev.filter(e => e.id_inventario !== id);
      saveCache(INV_KEY, updated);
      return updated;
    });
  }, []);

  const getByProducto = useCallback((id) => inventario.find(e => e.id_producto === id), [inventario]);

  return { inventario, upsert, eliminar, getByProducto };
}
