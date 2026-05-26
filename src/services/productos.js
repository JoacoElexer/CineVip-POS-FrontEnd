import api from './api.js';

export const getProductos = () => api.get('/api/products');
export const getProducto = (id) => api.get(`/api/products/${id}`);
export const createProducto = (data) => api.post('/api/products', data);
export const updateProducto = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteProducto = (id) => api.delete(`/api/products/${id}`);
