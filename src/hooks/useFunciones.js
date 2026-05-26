import { useState, useCallback } from 'react';

const STORAGE_KEY = 'pos_cine_funciones';
const SALA_KEY = 'pos_cine_salas';
const ASIENTO_KEY = 'pos_cine_asientos';

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

export function useSalas() {
  const [salas, setSalas] = useState(() => load(SALA_KEY));

  const agregar = useCallback((sala) => {
    const nueva = { ...sala, id_sala: nextId++ };
    setSalas(prev => {
      const updated = [...prev, nueva];
      save(SALA_KEY, updated);
      return updated;
    });
    return nueva;
  }, []);

  const actualizar = useCallback((id, data) => {
    setSalas(prev => {
      const updated = prev.map(s => s.id_sala === id ? { ...s, ...data } : s);
      save(SALA_KEY, updated);
      return updated;
    });
  }, []);

  const eliminar = useCallback((id) => {
    setSalas(prev => {
      const updated = prev.filter(s => s.id_sala !== id);
      save(SALA_KEY, updated);
      return updated;
    });
  }, []);

  return { salas, agregar, actualizar, eliminar };
}

export function useFunciones() {
  const [funciones, setFunciones] = useState(() => load(STORAGE_KEY));

  const agregarFuncion = useCallback((funcion) => {
    const nueva = { ...funcion, id_funcion: nextId++ };
    setFunciones(prev => {
      const updated = [...prev, nueva];
      save(STORAGE_KEY, updated);
      return updated;
    });
    return nueva;
  }, []);

  const editarFuncion = useCallback((id, data) => {
    setFunciones(prev => {
      const updated = prev.map(f => f.id_funcion === id ? { ...f, ...data } : f);
      save(STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const eliminarFuncion = useCallback((id) => {
    setFunciones(prev => {
      const updated = prev.filter(f => f.id_funcion !== id);
      save(STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  return {
    funciones,
    agregarFuncion, editarFuncion, eliminarFuncion
  };
}

export function useAsientos() {
  const [asientos, setAsientos] = useState(() => load(ASIENTO_KEY));

  const agregarLote = useCallback((nuevosAsientos) => {
    const conIds = nuevosAsientos.map(a => ({ ...a, id_asiento: nextId++ }));
    setAsientos(prev => {
      const updated = [...prev, ...conIds];
      save(ASIENTO_KEY, updated);
      return updated;
    });
    return conIds;
  }, []);

  const eliminarPorSala = useCallback((id_sala) => {
    setAsientos(prev => {
      const updated = prev.filter(a => a.id_sala !== id_sala);
      save(ASIENTO_KEY, updated);
      return updated;
    });
  }, []);

  const getPorSala = useCallback((id_sala) => asientos.filter(a => a.id_sala === id_sala),
    [asientos]);

  return { asientos, agregarLote, eliminarPorSala, getPorSala };
}
