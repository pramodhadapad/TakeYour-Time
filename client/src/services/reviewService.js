import api from './authService';

export const reviewService = {
  // Student
  submitReview: (data) => api.post('/api/reviews', data),
  
  // Public
  getTutorReviews: (slug) => api.get(`/api/reviews/public/${slug}`),
};

export default reviewService;
