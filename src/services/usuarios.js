import api from './api.js';

export const getEmpleados = () => api.get('/api/empleados');
export const getEmpleado = (id) => api.get(`/api/empleados/${id}`);
export const createEmpleado = (data) => api.post('/api/empleados', data);
export const updateEmpleado = (id, data) => api.put(`/api/empleados/${id}`, data);
export const deleteEmpleado = (id) => api.delete(`/api/empleados/${id}`);
export const login = (data) => api.post('/api/empleados/login', data);
