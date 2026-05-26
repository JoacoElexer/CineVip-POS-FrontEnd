import api from './api.js';

export const getInventario = () => api.get('/api/inventory');
export const updateInventario = (id, data) => api.put(`/api/inventory/${id}`, data);
export const patchInventario = (id, data) => api.patch('/api/inventory/update', { id_producto: id, ...data });
