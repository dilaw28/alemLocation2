import axios from 'axios';

const API_URL = '/api'; // proxied by Vite dev server → localhost:5000

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const carsAPI = {
  getAll: (params) => api.get('/cars', { params }),
  getFeatured: () => api.get('/cars/featured'),
  getById: (id) => api.get(`/cars/${id}`),
};

export const locationsAPI = {
  getAll: () => api.get('/locations'),
};

export const settingsAPI = {
  getAll: () => api.get('/settings'),
};

export const rentalsAPI = {
  create: (data) => api.post('/rentals', data),
  getMy: () => api.get('/rentals/my'),
  cancel: (id) => api.put(`/rentals/${id}/cancel`),
};

export const uploadAPI = {
  uploadImage: (file, folder = 'licenses') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
