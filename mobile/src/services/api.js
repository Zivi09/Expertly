import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

export const expertsApi = {
  list: (params) => api.get('/experts', { params }),
  getById: (id) => api.get(`/experts/${id}`),
};

export const bookingsApi = {
  create: (body) => api.post('/bookings', body),
  byEmail: (email) => api.get('/bookings', { params: { email } }),
};
