import { useState, useCallback, useEffect } from 'react';
import * as usuariosService from '../services/usuarios.js';

const CACHE_KEY = 'pos_cine_usuarios_cache';

function normalize(u) {
  return { ...u, id_usuario: u.id_usuario ?? u.id_empleado ?? u.id ?? u._id };
}

function toBackend(u) {
  const data = { ...u };
  data.id_empleado = data.id_usuario;
  delete data.id_usuario;
  return data;
}

function loadCache() {
  try { const d = localStorage.getItem(CACHE_KEY); return d ? JSON.parse(d) : []; } catch { return []; }
}
function saveCache(data) { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); }

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState(loadCache);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    usuariosService.getEmpleados()
      .then(res => { if (ignore) return; const data = Array.isArray(res.data) ? res.data : []; const normalized = data.map(normalize); setUsuarios(normalized); saveCache(normalized); setError(null); })
      .catch(() => { if (ignore) return; const c = loadCache(); if (c.length) setUsuarios(c); setError('Error al conectar. Usando datos locales.'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const recargar = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await usuariosService.getEmpleados();
      const data = Array.isArray(res.data) ? res.data : [];
      const normalized = data.map(normalize);
      setUsuarios(normalized); saveCache(normalized);
    } catch {
      const c = loadCache();
      if (c.length) setUsuarios(c);
      setError('Error al conectar. Usando datos locales.');
    } finally { setLoading(false); }
  }, []);

  const agregar = useCallback(async (usr) => {
    try {
      const res = await usuariosService.createEmpleado(toBackend(usr));
      const nuevo = normalize(res.data);
      setUsuarios(prev => { const u = [...prev, nuevo]; saveCache(u); return u; });
      return nuevo;
    } catch {
      const nuevo = { ...usr, id_usuario: 'temp_' + Date.now() };
      setUsuarios(prev => { const u = [...prev, nuevo]; saveCache(u); return u; });
      return nuevo;
    }
  }, []);

  const actualizar = useCallback(async (id, data) => {
    try {
      const res = await usuariosService.updateEmpleado(id, toBackend(data));
      const actualizado = normalize(res.data);
      setUsuarios(prev => { const u = prev.map(u => u.id_usuario === id ? actualizado : u); saveCache(u); return u; });
    } catch {
      setUsuarios(prev => { const u = prev.map(u => u.id_usuario === id ? { ...u, ...data } : u); saveCache(u); return u; });
    }
  }, []);

  const eliminar = useCallback(async (id) => {
    try { await usuariosService.deleteEmpleado(id); } catch { /* silent */ }
    setUsuarios(prev => { const u = prev.filter(u => u.id_usuario !== id); saveCache(u); return u; });
  }, []);

  return { usuarios, loading, error, agregar, actualizar, eliminar, recargar };
}
