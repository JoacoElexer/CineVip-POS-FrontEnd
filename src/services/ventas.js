import api from './api.js';

export const createVenta = (data) => api.post('/api/sales', data);
export const getVentas = (params) => api.get('/api/sales', { params });
export const getVenta = (id) => api.get(`/api/sales/${id}`);
export const deleteVenta = (id) => api.delete(`/api/sales/${id}`);
export const reservarBoletos = (data) => api.post('/api/tickets/book', data);
