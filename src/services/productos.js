import api from './api.js';

export const getProductos = () => api.get('/api/productos');
export const getProducto = (id) => api.get(`/api/productos/${id}`);
export const createProducto = (data) => api.post('/api/productos', data);
export const updateProducto = (id, data) => api.put(`/api/productos/${id}`, data);
export const deleteProducto = (id) => api.delete(`/api/productos/${id}`);
export const patchStock = (id, stock) => api.patch('/api/productos/stock', { id_producto: id, stock });
