const Review = require('../models/Review');
const Booking = require('../models/Booking');

// Student: Submit review
const submitReview = async (req, res, next) => {
  try {
    const { bookingId, rating, review } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    if (booking.status !== 'completed') {
      return res.status(400).json({ success: false, error: 'Can only review completed sessions' });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ bookingId, studentId: req.user._id });
    if (existing) return res.status(400).json({ success: false, error: 'Already reviewed' });

    const newReview = await Review.create({
      bookingId,
      sessionId: booking.sessionId,
      studentId: req.user._id,
      tutorId: booking.tutorId,
      rating,
      review
    });

    res.status(201).json({ success: true, data: newReview });
  } catch (err) { next(err); }
};

// Public: Get reviews for a tutor
const getTutorReviews = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const tutor = await User.findOne({ 'tutorProfile.slug': req.params.slug });
    if (!tutor) return res.status(404).json({ success: false, error: 'Tutor not found' });

    const reviews = await Review.find({ tutorId: tutor._id, isVisible: true })
      .populate('studentId', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
};

module.exports = { submitReview, getTutorReviews };
