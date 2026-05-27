import { useState, useCallback, useEffect } from 'react';
import * as funcionesService from '../services/funciones.js';

const SALA_KEY = 'pos_cine_salas_cache';
const FUNC_KEY = 'pos_cine_funciones_cache';
const ASIENTO_KEY = 'pos_cine_asientos_cache';

function normalizeFuncion(f) {
  return {
    ...f,
    id_funcion: f.id_funcion ?? f.id ?? f._id,
    id_sala: f.id_sala ?? f.sala_id,
    precio: Number(f.precio ?? f.precio_boleto) || 0,
    pelicula_id_mongo: f.pelicula_id ?? f.pelicula_id_mongo,
    horario: f.horario || (f.fecha && f.hora ? `${f.fecha} ${f.hora}`.trim() : ''),
  };
}

function toBackendFuncion(f) {
  const data = { ...f };
  data.pelicula_id = data.pelicula_id_mongo;
  delete data.pelicula_id_mongo;
  return data;
}

function loadCache(key) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : []; } catch { return []; }
}
function saveCache(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

export function useSalas() {
  const [salas, setSalas] = useState(() => loadCache(SALA_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    funcionesService.getSalas()
      .then(res => { if (ignore) return; const data = Array.isArray(res.data) ? res.data : []; const norm = data.map(s => ({ ...s, id_sala: s.id_sala ?? s.id })); setSalas(norm); saveCache(SALA_KEY, norm); setError(null); })
      .catch(() => { if (ignore) return; const c = loadCache(SALA_KEY); if (c.length) setSalas(c); setError('Error al conectar. Usando datos locales.'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const recargar = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await funcionesService.getSalas();
      const data = Array.isArray(res.data) ? res.data : [];
      const norm = data.map(s => ({ ...s, id_sala: s.id_sala ?? s.id }));
      setSalas(norm); saveCache(SALA_KEY, norm);
    } catch {
      const c = loadCache(SALA_KEY);
      if (c.length) setSalas(c);
      setError('Error al conectar. Usando datos locales.');
    } finally { setLoading(false); }
  }, []);

  const agregar = useCallback(async (sala) => {
    try {
      const res = await funcionesService.createSala(sala);
      const nueva = res.data;
      setSalas(prev => { const u = [...prev, nueva]; saveCache(SALA_KEY, u); return u; });
      return nueva;
    } catch {
      const nueva = { ...sala, id_sala: 'temp_' + Date.now() };
      setSalas(prev => { const u = [...prev, nueva]; saveCache(SALA_KEY, u); return u; });
      return nueva;
    }
  }, []);

  const actualizar = useCallback(async (id, data) => {
    try {
      const res = await funcionesService.updateSala(id, data);
      const actualizada = res.data;
      setSalas(prev => { const u = prev.map(s => s.id_sala === id ? actualizada : s); saveCache(SALA_KEY, u); return u; });
    } catch {
      setSalas(prev => { const u = prev.map(s => s.id_sala === id ? { ...s, ...data } : s); saveCache(SALA_KEY, u); return u; });
    }
  }, []);

  const eliminar = useCallback(async (id) => {
    try { await funcionesService.deleteSala(id); } catch { /* silent */ }
    setSalas(prev => { const u = prev.filter(s => s.id_sala !== id); saveCache(SALA_KEY, u); return u; });
  }, []);

  return { salas, loading, error, agregar, actualizar, eliminar, recargar };
}

export function useFunciones() {
  const [funciones, setFunciones] = useState(() => loadCache(FUNC_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    funcionesService.getFunciones()
      .then(res => { if (ignore) return; const data = Array.isArray(res.data) ? res.data : []; const normalized = data.map(normalizeFuncion); setFunciones(normalized); saveCache(FUNC_KEY, normalized); setError(null); })
      .catch(() => { if (ignore) return; const c = loadCache(FUNC_KEY); if (c.length) setFunciones(c); setError('Error al conectar. Usando datos locales.'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const recargar = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await funcionesService.getFunciones();
      const data = Array.isArray(res.data) ? res.data : [];
      const normalized = data.map(normalizeFuncion);
      setFunciones(normalized); saveCache(FUNC_KEY, normalized);
    } catch {
      const c = loadCache(FUNC_KEY);
      if (c.length) setFunciones(c);
      setError('Error al conectar. Usando datos locales.');
    } finally { setLoading(false); }
  }, []);

  const agregarFuncion = useCallback(async (f) => {
    try {
      const res = await funcionesService.createFuncion(toBackendFuncion(f));
      const nueva = normalizeFuncion(res.data);
      setFunciones(prev => { const u = [...prev, nueva]; saveCache(FUNC_KEY, u); return u; });
      return nueva;
    } catch {
      const nueva = { ...f, id_funcion: 'temp_' + Date.now() };
      setFunciones(prev => { const u = [...prev, nueva]; saveCache(FUNC_KEY, u); return u; });
      return nueva;
    }
  }, []);

  const editarFuncion = useCallback(async (id, data) => {
    try {
      const res = await funcionesService.updateFuncion(id, toBackendFuncion(data));
      const actualizada = normalizeFuncion(res.data);
      setFunciones(prev => { const u = prev.map(f => f.id_funcion === id ? actualizada : f); saveCache(FUNC_KEY, u); return u; });
    } catch {
      setFunciones(prev => { const u = prev.map(f => f.id_funcion === id ? { ...f, ...data } : f); saveCache(FUNC_KEY, u); return u; });
    }
  }, []);

  const eliminarFuncion = useCallback(async (id) => {
    try { await funcionesService.deleteFuncion(id); } catch { /* silent */ }
    setFunciones(prev => { const u = prev.filter(f => f.id_funcion !== id); saveCache(FUNC_KEY, u); return u; });
  }, []);

  return { funciones, loading, error, agregarFuncion, editarFuncion, eliminarFuncion, recargar };
}

export function useAsientos() {
  const [asientos, setAsientos] = useState(() => loadCache(ASIENTO_KEY));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPorSala = useCallback(async (salaId) => {
    setLoading(true); setError(null);
    try {
      const res = await funcionesService.getAsientosPorSala(salaId);
      const data = Array.isArray(res.data) ? res.data : [];
      const norm = data.map(a => ({ ...a, id_asiento: a.id_asiento ?? a.id, id_sala: a.id_sala ?? a.sala_id }));
      setAsientos(norm); saveCache(ASIENTO_KEY, norm);
      return norm;
    } catch {
      const c = loadCache(ASIENTO_KEY);
      if (c.length) setAsientos(c);
      setError('Error al conectar. Usando datos locales.');
      return [];
    } finally { setLoading(false); }
  }, []);

  const agregarLote = useCallback(async (nuevosAsientos) => {
    const resultados = [];
    for (const a of nuevosAsientos) {
      try {
        const res = await funcionesService.createAsiento(a);
        const norm = { ...res.data, id_asiento: res.data.id_asiento ?? res.data.id, id_sala: res.data.id_sala ?? res.data.sala_id };
        resultados.push(norm);
      } catch {
        resultados.push({ ...a, id_asiento: 'temp_' + Date.now() + Math.random() });
      }
    }
    setAsientos(prev => { const u = [...prev, ...resultados]; saveCache(ASIENTO_KEY, u); return u; });
    return resultados;
  }, []);

  const eliminarPorSala = useCallback((salaId) => {
    setAsientos(prev => { const u = prev.filter(a => a.id_sala !== salaId); saveCache(ASIENTO_KEY, u); return u; });
  }, []);

  const getPorSala = useCallback((salaId) => asientos.filter(a => a.id_sala === salaId), [asientos]);

  return { asientos, loading, error, fetchPorSala, agregarLote, eliminarPorSala, getPorSala };
}
