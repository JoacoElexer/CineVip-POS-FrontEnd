import { useState, useCallback, useEffect } from 'react';
import * as peliculasService from '../services/peliculas.js';

const CACHE_KEY = 'pos_cine_peliculas_cache';

function normalize(p) {
  return { ...p, id: p._id || p.id, nombre: p.titulo || p.nombre };
}

function toBackend(p) {
  const data = { ...p };
  delete data.id;
  data.titulo = data.nombre;
  delete data.nombre;
  return data;
}

function loadCache() {
  try {
    const d = localStorage.getItem(CACHE_KEY);
    return d ? JSON.parse(d) : [];
  } catch { return []; }
}

function saveCache(data) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

export function usePeliculas() {
  const [peliculas, setPeliculas] = useState(loadCache);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    peliculasService.getPeliculas()
      .then(res => { if (ignore) return; const data = Array.isArray(res.data) ? res.data : []; const normalized = data.map(normalize); setPeliculas(normalized); saveCache(normalized); setError(null); })
      .catch(() => { if (ignore) return; const cached = loadCache(); if (cached.length) setPeliculas(cached); setError('Error al conectar con el servidor. Usando datos locales.'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const recargar = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await peliculasService.getPeliculas();
      const data = Array.isArray(res.data) ? res.data : [];
      const normalized = data.map(normalize);
      setPeliculas(normalized); saveCache(normalized);
    } catch {
      const cached = loadCache();
      if (cached.length) setPeliculas(cached);
      setError('Error al conectar con el servidor. Usando datos locales.');
    } finally { setLoading(false); }
  }, []);

  const agregar = useCallback(async (pel) => {
    try {
      const res = await peliculasService.createPelicula(toBackend(pel));
      const nueva = normalize(res.data);
      setPeliculas(prev => { const u = [...prev, nueva]; saveCache(u); return u; });
      return nueva;
    } catch {
      const nueva = { ...pel, id: 'temp_' + Date.now() };
      setPeliculas(prev => { const u = [...prev, nueva]; saveCache(u); return u; });
      return nueva;
    }
  }, []);

  const actualizar = useCallback(async (id, data) => {
    try {
      const res = await peliculasService.updatePelicula(id, toBackend(data));
      const actualizada = normalize(res.data);
      setPeliculas(prev => { const u = prev.map(p => p.id === id ? actualizada : p); saveCache(u); return u; });
    } catch {
      setPeliculas(prev => { const u = prev.map(p => p.id === id ? { ...p, ...data } : p); saveCache(u); return u; });
    }
  }, []);

  const eliminar = useCallback(async (id) => {
    try { await peliculasService.deletePelicula(id); } catch { /* silent */ }
    setPeliculas(prev => { const u = prev.filter(p => p.id !== id); saveCache(u); return u; });
  }, []);

  return { peliculas, loading, error, agregar, actualizar, eliminar, recargar };
}
