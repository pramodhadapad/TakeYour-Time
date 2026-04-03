import api from './authService';

export const bookingService = {
  // Public
  getTutor: (slug) => api.get(`/api/public/${slug}`),
  getTutorSessions: (slug) => api.get(`/api/public/${slug}/sessions`),
  getAvailability: (slug, date, sessionId) => {
    let url = `/api/public/${slug}/availability?date=${date}`;
    if (sessionId) url += `&sessionId=${sessionId}`;
    return api.get(url);
  },
  createBooking: (slug, data) => api.post(`/api/public/${slug}/book`, data),

  // Payments
  verifyPayment: (data) => api.post('/api/payments/verify', data),

  // Student
  getMyBookings: () => api.get('/api/student/bookings'),
  getUpcoming: () => api.get('/api/student/bookings/upcoming'),
  getPast: () => api.get('/api/student/bookings/past'),
  cancelBooking: (id) => api.post(`/api/student/bookings/${id}/cancel`),

  // Tutor
  getTutorDashboardStats: () => api.get('/api/tutor/dashboard/stats'),
  getTutorBookings: () => api.get('/api/tutor/bookings'),
  updateBookingStatus: (id, status) => api.patch(`/api/tutor/bookings/${id}`, { status }),
  deleteBooking: (id) => api.delete(`/api/tutor/bookings/${id}`),
  getTutorStudents: () => api.get('/api/tutor/students'),
};

export default bookingService;
