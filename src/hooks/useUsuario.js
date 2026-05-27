import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const KEY = 'pos_cine_usuarios';

export function useUsuario() {
  const { user } = useAuth();
  const [usuario, setUsuario] = useState(user);

  const actualizar = useCallback((data) => {
    setUsuario(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { usuario, actualizar };
}
