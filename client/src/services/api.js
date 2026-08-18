import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Déconnexion automatique si le token admin est expiré/invalide
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('adminToken')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getUserDetail: (id) => api.get(`/admin/users/${id}`),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle-active`),
};

export const rentalsAPI = {
  getAll: (params) => api.get('/rentals', { params }),
  approve: (id, note) => api.put(`/rentals/${id}/approve`, { adminNote: note }),
  reject: (id, note) => api.put(`/rentals/${id}/reject`, { adminNote: note }),
  complete: (id) => api.put(`/rentals/${id}/complete`),
  cancel: (id, note) => api.put(`/rentals/${id}/cancel`, { adminNote: note }),
};

export const carsAPI = {
  getAll: () => api.get('/cars'),
  create: (data) => api.post('/cars', data),
  update: (id, data) => api.put(`/cars/${id}`, data),
  delete: (id) => api.delete(`/cars/${id}`),
};

export const locationsAPI = {
  getAll: () => api.get('/locations/all'),
  create: (data) => api.post('/locations', data),
  update: (id, data) => api.put(`/locations/${id}`, data),
  delete: (id) => api.delete(`/locations/${id}`),
};

export const settingsAPI = {
  getAll: () => api.get('/settings'),
  update: (key, value) => api.put(`/settings/${key}`, { value }),
};

export const uploadAPI = {
  uploadImage: async (file, folder = 'cars') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  purgeAllLicenses: () => api.delete('/upload/licenses/purge-all'),
};

export const availabilityAPI = {
  getOverview:  ()              => api.get('/availability/overview'),
  getCalendar:  (carId)         => api.get(`/availability/${carId}/calendar`),
  block:        (carId, data)   => api.post(`/availability/${carId}/block`, data),
  bookManual:   (carId, data)   => api.post(`/availability/${carId}/book`, data),
  toggle:       (carId, reason) => api.put(`/availability/${carId}/toggle`, { reason }),
  deletePeriod: (rentalId)      => api.delete(`/availability/period/${rentalId}`),
};

export default api;
