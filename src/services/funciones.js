import api from './api.js';

export const getSalas = () => api.get('/api/salas');
export const getFunciones = (params) => api.get('/api/funciones', { params });
export const getAsientosPorSala = (id_sala) => api.get(`/api/asientos/${id_sala}`);
