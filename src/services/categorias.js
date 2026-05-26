import api from './api.js';

export const getCategorias = () => api.get('/api/categories');
export const getCategoria = (id) => api.get(`/api/categories/${id}`);
export const createCategoria = (data) => api.post('/api/categories', data);
export const updateCategoria = (id, data) => api.put(`/api/categories/${id}`, data);
export const deleteCategoria = (id) => api.delete(`/api/categories/${id}`);
