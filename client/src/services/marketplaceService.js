import api from './authService';

export const sessionService = {
  // Tutor actions
  getTutorSessions: () => api.get('/api/tutor/sessions'),
  createSession: (data) => api.post('/api/tutor/sessions', data),
  updateSession: (id, data) => api.put(`/api/tutor/sessions/${id}`, data),
  deleteSession: (id) => api.delete(`/api/tutor/sessions/${id}`),
  updateProfile: (data) => api.put('/api/tutor/profile', data),
};

export const slotService = {
  // Public
  getSessionSlots: (sessionId) => api.get(`/api/slots/session/${sessionId}`),
  
  // Tutor actions
  getTutorSlots: () => api.get('/api/slots/tutor/me'),
  createSlot: (data) => api.post('/api/slots', data),
  deleteSlot: (id) => api.delete(`/api/slots/${id}`),
};

export const tutorMarketplaceService = {
  // Public
  getPublicTutors: () => api.get('/api/tutors'),
};
