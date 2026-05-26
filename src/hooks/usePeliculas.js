import { useState, useCallback } from 'react';

const MOVIE_KEY = 'pos_cine_peliculas';

let nextId = Date.now();

function load() {
  try {
    const data = localStorage.getItem(MOVIE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function save(data) {
  localStorage.setItem(MOVIE_KEY, JSON.stringify(data));
}

export function usePeliculas() {
  const [peliculas, setPeliculas] = useState(load);

  const agregar = useCallback((pel) => {
    const nueva = { ...pel, id: nextId++ };
    setPeliculas(prev => {
      const updated = [...prev, nueva];
      save(updated);
      return updated;
    });
    return nueva;
  }, []);

  const actualizar = useCallback((id, data) => {
    setPeliculas(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...data } : p);
      save(updated);
      return updated;
    });
  }, []);

  const eliminar = useCallback((id) => {
    setPeliculas(prev => {
      const updated = prev.filter(p => p.id !== id);
      save(updated);
      return updated;
    });
  }, []);

  return { peliculas, agregar, actualizar, eliminar };
}
