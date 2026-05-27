import api from './api.js';

export const getPeliculas = () => api.get('/api/peliculas');
export const getPelicula = (id) => api.get(`/api/peliculas/${id}`);
export const createPelicula = (data) => api.post('/api/peliculas', data);
export const updatePelicula = (id, data) => api.put(`/api/peliculas/${id}`, data);
export const deletePelicula = (id) => api.delete(`/api/peliculas/${id}`);
export const buscarPeliculas = (q) => api.get('/api/peliculas/buscar', { params: { q } });
