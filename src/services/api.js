import axios from 'axios';
import logService from '../utils/logService.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://cinevip-pos-backend.onrender.com'),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  config._startTime = Date.now();
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  logService.debug('API', 'request', {
    method: config.method?.toUpperCase(),
    url: config.url,
    params: config.params,
    hasToken: !!token,
  });
  return config;
});

api.interceptors.response.use(
  response => {
    const duration = Date.now() - (response.config._startTime || Date.now());
    logService.debug('API', 'response_success', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      durationMs: duration,
    });
    return response;
  },
  error => {
    const duration = Date.now() - (error.config?._startTime || Date.now());
    const data = {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      durationMs: duration,
      errorMessage: error.message,
      responseData: error.response?.data,
    };
    if (error.response?.status >= 500) {
      logService.error('API', 'response_error', error, data);
    } else {
      logService.warn('API', 'response_error', data);
    }
    return Promise.reject(error);
  }
);

export default api;
