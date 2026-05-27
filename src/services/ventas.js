import api from './api.js';

export const createVenta = (data) => api.post('/api/ventas', data);
export const getVentas = (params) => api.get('/api/ventas', { params });
export const getVenta = (id) => api.get(`/api/ventas/${id}`);
export const deleteVenta = (id) => api.delete(`/api/ventas/${id}`);
export const getVentasPorFecha = (fecha) => api.get(`/api/ventas/fecha/${fecha}`);
