import api from './api.js';

// Salas
export const getSalas = () => api.get('/api/salas');
export const getSala = (id) => api.get(`/api/salas/${id}`);
export const createSala = (data) => api.post('/api/salas', data);
export const updateSala = (id, data) => api.put(`/api/salas/${id}`, data);
export const deleteSala = (id) => api.delete(`/api/salas/${id}`);

// Funciones
export const getFunciones = (params) => api.get('/api/funciones', { params });
export const getFuncion = (id) => api.get(`/api/funciones/${id}`);
export const createFuncion = (data) => api.post('/api/funciones', data);
export const updateFuncion = (id, data) => api.put(`/api/funciones/${id}`, data);
export const deleteFuncion = (id) => api.delete(`/api/funciones/${id}`);
export const getFuncionesPorPelicula = (peliculaId) => api.get(`/api/funciones/pelicula/${peliculaId}`);

// Asientos
export const getAsientosPorSala = (salaId) => api.get(`/api/asientos/sala/${salaId}`);
export const createAsiento = (data) => api.post('/api/asientos', data);
export const deleteAsiento = (id) => api.delete(`/api/asientos/${id}`);
export const updateAsiento = (id, data) => api.put(`/api/asientos/${id}`, data);
