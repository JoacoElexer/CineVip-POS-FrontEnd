import api from './api.js';

export const getPromociones = () => api.get('/api/promociones');
export const getPromocion = (id) => api.get(`/api/promociones/${id}`);
export const createPromocion = (data) => api.post('/api/promociones', data);
export const updatePromocion = (id, data) => api.put(`/api/promociones/${id}`, data);
export const deletePromocion = (id) => api.delete(`/api/promociones/${id}`);
export const getPromocionesActivas = () => api.get('/api/promociones/activas');
