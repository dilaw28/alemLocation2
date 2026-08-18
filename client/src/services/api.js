import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Déconnexion automatique si le token est expiré/invalide (401),
// évite que l'utilisateur reste bloqué sur des appels qui échouent en boucle.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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

export const availabilityAPI = {
  getPublicCalendar: (carId) => api.get(`/availability/${carId}/public-calendar`),
};
