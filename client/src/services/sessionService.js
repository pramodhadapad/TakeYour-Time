import api from './authService';

export const sessionService = {
  // Tutor session management
  createSession: (data) => api.post('/api/tutor/sessions', data),
  updateSession: (id, data) => api.put(`/api/tutor/sessions/${id}`, data),
  deleteSession: (id) => api.delete(`/api/tutor/sessions/${id}`),
  getAvailability: () => api.get('/api/tutor/availability'),
  updateAvailability: (data) => api.put('/api/tutor/availability', data),
  updateProfile: (data) => api.put('/api/tutor/profile', data),
};

export default sessionService;
