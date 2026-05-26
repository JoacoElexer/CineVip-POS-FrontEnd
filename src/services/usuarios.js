import api from './api.js';

export const getUsuarios = () => api.get('/api/usuarios');
export const getUsuario = (id) => api.get(`/api/usuarios/${id}`);
export const createUsuario = (data) => api.post('/api/usuarios', data);
export const updateUsuario = (id, data) => api.put(`/api/usuarios/${id}`, data);
export const deleteUsuario = (id) => api.delete(`/api/usuarios/${id}`);
export const login = (data) => api.post('/api/auth/login', data);
