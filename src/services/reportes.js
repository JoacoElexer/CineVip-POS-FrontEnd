import api from './api.js';

export const getReportePorFecha = (fecha) => api.get(`/api/reportes?fecha=${fecha}`);
export const getReportesGuardados = () => api.get('/api/reportes');
export const deleteReporte = (id) => api.delete(`/api/reportes/${id}`);
