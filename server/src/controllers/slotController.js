const AvailabilitySlot = require('../models/AvailabilitySlot');
const Session = require('../models/Session');

// @desc    Create new availability slot(s)
// @route   POST /api/slots
// @access  Private (Tutor)
const createSlot = async (req, res, next) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ success: false, error: 'Only tutors can create slots' });
    }

    const { sessionId, startTime, endTime } = req.body;

    // Verify session
    const session = await Session.findOne({ _id: sessionId, tutorId: req.user._id });
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found or does not belong to you' });
    }

    const slot = await AvailabilitySlot.create({
      tutorId: req.user._id,
      sessionId: session._id,
      startTime,
      endTime,
      capacity: session.maxCapacity || 1,
      bookedCount: 0
    });

    res.status(201).json({ success: true, data: slot });
  } catch (err) {
    next(err);
  }
};

// @desc    Get slots for a specific session (for students Booking page)
// @route   GET /api/slots/session/:sessionId
// @access  Public
const getSessionSlots = async (req, res, next) => {
  try {
    const slots = await AvailabilitySlot.find({ 
      sessionId: req.params.sessionId,
      startTime: { $gt: new Date() } // only future slots
    }).sort({ startTime: 1 });
    
    res.status(200).json({ success: true, count: slots.length, data: slots });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all slots for the logged in tutor
// @route   GET /api/slots/tutor/me
// @access  Private (Tutor)
const getTutorSlots = async (req, res, next) => {
  try {
    const slots = await AvailabilitySlot.find({ tutorId: req.user._id })
      .populate('sessionId', 'title type durationMinutes price currency')
      .sort({ startTime: 1 });
      
    res.status(200).json({ success: true, count: slots.length, data: slots });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a slot
// @route   DELETE /api/slots/:id
// @access  Private (Tutor)
const deleteSlot = async (req, res, next) => {
  try {
    const slot = await AvailabilitySlot.findOne({ _id: req.params.id, tutorId: req.user._id });
    if (!slot) {
      return res.status(404).json({ success: false, error: 'Slot not found' });
    }

    if (slot.bookedCount > 0) {
      return res.status(400).json({ success: false, error: 'Cannot delete a slot that has active bookings. Cancel the bookings first.' });
    }

    await slot.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSlot,
  getSessionSlots,
  getTutorSlots,
  deleteSlot
};
