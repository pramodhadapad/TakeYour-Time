const Session = require('../models/Session');
const Availability = require('../models/Availability');

// Tutor: Get own session types
const getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ tutorId: req.user._id, isActive: true });
    res.json({ success: true, data: sessions });
  } catch (err) { next(err); }
};

// Tutor: Create session type
const createSession = async (req, res, next) => {
  try {
    const session = await Session.create({ ...req.body, tutorId: req.user._id });
    res.status(201).json({ success: true, data: session });
  } catch (err) { 
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages[0] });
    }
    next(err); 
  }
};

// Tutor: Update session type
const updateSession = async (req, res, next) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, tutorId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.status(200).json({ success: true, data: session });
  } catch (err) { 
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages[0] });
    }
    next(err); 
  }
};

// Tutor: Deactivate session
const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, tutorId: req.user._id },
      { isActive: false },
      { new: true }
    );
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (err) { next(err); }
};

// Tutor: Get availability
const getAvailability = async (req, res, next) => {
  try {
    let availability = await Availability.findOne({ tutorId: req.user._id });
    if (!availability) {
      availability = { weeklySchedule: [], blockedDates: [] };
    }
    res.json({ success: true, data: availability });
  } catch (err) { next(err); }
};

// Tutor: Update availability
const updateAvailability = async (req, res, next) => {
  try {
    const availability = await Availability.findOneAndUpdate(
      { tutorId: req.user._id },
      { ...req.body, tutorId: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: availability });
  } catch (err) { next(err); }
};

// Tutor: Update profile
const updateTutorProfile = async (req, res, next) => {
  try {
    const { slug, bio, subjects, cancellationHours, isPublic } = req.body;
    const user = req.user;
    
    if (!user.tutorProfile) {
      user.tutorProfile = {};
    }
    
    if (slug !== undefined) user.tutorProfile.slug = slug;
    if (bio !== undefined) user.tutorProfile.bio = bio;
    if (subjects !== undefined) user.tutorProfile.subjects = subjects;
    if (cancellationHours !== undefined) user.tutorProfile.cancellationHours = cancellationHours;
    if (isPublic !== undefined) user.tutorProfile.isPublic = isPublic;
    
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

module.exports = {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  getAvailability,
  updateAvailability,
  updateTutorProfile
};
