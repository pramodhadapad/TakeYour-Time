const bookingService = require('../services/BookingService');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Session = require('../models/Session');
const Availability = require('../models/Availability');

// Public: Get tutor profile by slug
const getTutorBySlug = async (req, res, next) => {
  try {
    const tutor = await User.findOne({ 'tutorProfile.slug': req.params.slug, role: 'tutor' })
      .select('-googleAccessToken -googleRefreshToken');
    if (!tutor) return res.status(404).json({ success: false, error: 'Tutor not found' });
    res.json({ success: true, data: tutor });
  } catch (err) { next(err); }
};

// Public: Get session types for a tutor
const getTutorSessions = async (req, res, next) => {
  try {
    const tutor = await User.findOne({ 'tutorProfile.slug': req.params.slug });
    if (!tutor) return res.status(404).json({ success: false, error: 'Tutor not found' });
    const sessions = await Session.find({ tutorId: tutor._id, isActive: true });
    res.json({ success: true, data: sessions });
  } catch (err) { next(err); }
};

// Public: Get available slots
const getAvailability = async (req, res, next) => {
  try {
    const tutor = await User.findOne({ 'tutorProfile.slug': req.params.slug });
    if (!tutor) return res.status(404).json({ success: false, error: 'Tutor not found' });
    const { date, sessionId } = req.query;
    if (!date) return res.status(400).json({ success: false, error: 'date query param required' });
    const slots = await bookingService.getAvailableSlots(tutor._id, date, sessionId);
    res.json({ success: true, data: slots });
  } catch (err) { next(err); }
};

// Student: Create booking
const createBooking = async (req, res, next) => {
  try {
    const { sessionId, slotId, paymentMethod } = req.body;
    const result = await bookingService.createBooking({
      sessionId,
      studentId: req.user._id,
      slotId,
      paymentMethod
    });
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
};

// Student: Get all bookings
const getStudentBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ studentId: req.user._id })
      .populate('sessionId tutorId')
      .sort({ scheduledAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) { next(err); }
};

// Student: Get upcoming bookings
const getUpcomingBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      studentId: req.user._id,
      scheduledAt: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed'] }
    }).populate('sessionId tutorId').sort({ scheduledAt: 1 });
    res.json({ success: true, data: bookings });
  } catch (err) { next(err); }
};

// Student: Get past bookings
const getPastBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      studentId: req.user._id,
      $or: [
        { scheduledAt: { $lt: new Date() } },
        { status: { $in: ['completed', 'cancelled', 'no_show'] } }
      ]
    }).populate('sessionId tutorId').sort({ scheduledAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) { next(err); }
};

// Student: Cancel booking
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user._id);
    res.json({ success: true, data: booking });
  } catch (err) { next(err); }
};

// Tutor: Get all bookings
const getTutorBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ tutorId: req.user._id })
      .populate('sessionId studentId')
      .sort({ scheduledAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) { next(err); }
};

// Tutor: Update booking status (confirm / no_show)
const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, tutorId: req.user._id });
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    const { status } = req.body;
    if (!['confirmed', 'no_show', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    booking.status = status;
    // When tutor completes a session, mark payment as collected
    if (status === 'completed' && booking.paymentStatus === 'unpaid') {
      booking.paymentStatus = 'paid';
    }
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (err) { next(err); }
};

// Tutor: Dashboard stats
const getDashboardStats = async (req, res, next) => {
  try {
    const tutorId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalBookings = await Booking.countDocuments({ tutorId });
    const monthBookings = await Booking.countDocuments({ tutorId, createdAt: { $gte: startOfMonth } });
    const noShows = await Booking.countDocuments({ tutorId, status: 'no_show' });
    const noShowRate = totalBookings > 0 ? ((noShows / totalBookings) * 100).toFixed(1) : 0;

    // Revenue this month (completed + paid bookings)
    const monthRevenue = await Booking.aggregate([
      { $match: { tutorId: req.user._id, status: 'completed', createdAt: { $gte: startOfMonth } } },
      { $lookup: { from: 'sessions', localField: 'sessionId', foreignField: '_id', as: 'session' } },
      { $unwind: '$session' },
      { $group: { _id: null, total: { $sum: '$session.price' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        monthBookings,
        noShowRate: parseFloat(noShowRate),
        monthRevenue: monthRevenue.length > 0 ? monthRevenue[0].total : 0
      }
    });
  } catch (err) { next(err); }
};

// Tutor: Delete a completed/cancelled/no_show booking from history
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, tutorId: req.user._id });
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    if (!['completed', 'cancelled', 'no_show'].includes(booking.status)) {
      return res.status(400).json({ success: false, error: 'Can only delete completed, cancelled, or no-show bookings.' });
    }
    await booking.deleteOne();
    res.json({ success: true, message: 'Booking deleted.' });
  } catch (err) { next(err); }
};

// Tutor: Student list
const getTutorStudents = async (req, res, next) => {
  try {
    const studentIds = await Booking.distinct('studentId', { tutorId: req.user._id });
    const students = await User.find({ _id: { $in: studentIds } }).select('-googleAccessToken -googleRefreshToken');
    res.json({ success: true, data: students });
  } catch (err) { next(err); }
};

module.exports = {
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
};
