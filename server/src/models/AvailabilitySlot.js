const mongoose = require('mongoose');

const AvailabilitySlotSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Tutor ID is required'] },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: [true, 'Class selection is required'] },
  startTime: { type: Date, required: [true, 'Start time is required'] },
  endTime: { type: Date, required: [true, 'End time is required'] },
  capacity: { type: Number, default: 1, min: [1, 'Capacity must be at least 1'] }, // Copied from session at creation time
  bookedCount: { type: Number, default: 0 },
  status: { type: String, enum: { values: ['available', 'full', 'cancelled'], message: '{VALUE} is not a valid status' }, default: 'available' }
}, { timestamps: true });

// Ensure we can easily query slots that are not fully booked without pulling all data
AvailabilitySlotSchema.index({ tutorId: 1, sessionId: 1, startTime: 1 });

module.exports = mongoose.model('AvailabilitySlot', AvailabilitySlotSchema);
