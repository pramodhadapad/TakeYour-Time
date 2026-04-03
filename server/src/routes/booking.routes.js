const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const { requireStudent, requireTutor } = require('../middlewares/roleMiddleware');
const {
  getTutorBySlug,
  getTutorSessions,
  getAvailability,
  createBooking,
  getStudentBookings,
  getUpcomingBookings,
  getPastBookings,
  cancelBooking,
  getTutorBookings,
  updateBookingStatus,
  getDashboardStats,
  deleteBooking,
  getTutorStudents
} = require('../controllers/bookingController');

const router = express.Router();

// Public routes
router.get('/public/:slug', getTutorBySlug);
router.get('/public/:slug/sessions', getTutorSessions);
router.get('/public/:slug/availability', getAvailability);
router.post('/public/:slug/book', requireAuth, createBooking);

// Student routes
router.get('/student/bookings', requireAuth, requireStudent, getStudentBookings);
router.get('/student/bookings/upcoming', requireAuth, requireStudent, getUpcomingBookings);
router.get('/student/bookings/past', requireAuth, requireStudent, getPastBookings);
router.post('/student/bookings/:id/cancel', requireAuth, requireStudent, cancelBooking);

// Tutor routes
router.get('/tutor/dashboard/stats', requireAuth, requireTutor, getDashboardStats);
router.get('/tutor/bookings', requireAuth, requireTutor, getTutorBookings);
router.patch('/tutor/bookings/:id', requireAuth, requireTutor, updateBookingStatus);
router.delete('/tutor/bookings/:id', requireAuth, requireTutor, deleteBooking);
router.get('/tutor/students', requireAuth, requireTutor, getTutorStudents);

module.exports = router;
