import api from './api.js';

export const getCategorias = () => api.get('/api/categorias');
export const getCategoria = (id) => api.get(`/api/categorias/${id}`);
export const createCategoria = (data) => api.post('/api/categorias', data);
export const updateCategoria = (id, data) => api.put(`/api/categorias/${id}`, data);
export const deleteCategoria = (id) => api.delete(`/api/categorias/${id}`);
