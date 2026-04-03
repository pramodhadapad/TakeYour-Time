const mongoose = require('mongoose');

const AvailabilitySlotSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  capacity: { type: Number, default: 1 }, // Copied from session at creation time
  bookedCount: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'full', 'cancelled'], default: 'available' }
}, { timestamps: true });

// Ensure we can easily query slots that are not fully booked without pulling all data
AvailabilitySlotSchema.index({ tutorId: 1, sessionId: 1, startTime: 1 });

module.exports = mongoose.model('AvailabilitySlot', AvailabilitySlotSchema);
