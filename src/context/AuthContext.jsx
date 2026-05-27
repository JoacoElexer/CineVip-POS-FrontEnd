/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { login as loginApi } from '../services/usuarios.js';

const AuthContext = createContext(null);

function getInitialUser() {
  try {
    const saved = sessionStorage.getItem('pos_cine_usuarios');
    const token = sessionStorage.getItem('token');
    if (saved && token) return JSON.parse(saved);
  } catch {
    // ignore parse errors
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  function clearSession() {
    sessionStorage.removeItem('pos_cine_usuarios');
    sessionStorage.removeItem('token');
    setUser(null);
  }

  async function login(usuario, password) {
    const res = await loginApi({ usuario, password });
    const data = res.data;
    const token = data.token || data.accessToken;
    const empleado = data.empleado || data.user || data;
    const userData = {
      id_usuario: empleado.id ?? empleado.id_usuario ?? empleado._id,
      nombre: empleado.nombre,
      usuario: empleado.usuario,
      rol: empleado.rol,
    };
    if (token) sessionStorage.setItem('token', token);
    sessionStorage.setItem('pos_cine_usuarios', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }

  function logout() {
    clearSession();
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
