import api from './api.js';

export const getReportePorFecha = (fecha) => api.get(`/api/reportes-cierre?fecha=${fecha}`);
export const getReportesGuardados = () => api.get('/api/reportes-cierre');
export const deleteReporte = (id) => api.delete(`/api/reportes-cierre/${id}`);
export const saveReporte = (data) => api.post('/api/reportes-cierre', data);
