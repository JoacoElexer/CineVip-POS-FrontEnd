import api from './api.js';

export const getPeliculas = () => api.get('/api/movies');
export const getPelicula = (id) => api.get(`/api/movies/${id}`);
export const createPelicula = (data) => api.post('/api/movies', data);
export const updatePelicula = (id, data) => api.put(`/api/movies/${id}`, data);
export const deletePelicula = (id) => api.delete(`/api/movies/${id}`);
