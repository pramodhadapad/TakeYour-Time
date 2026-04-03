const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  weeklySchedule: [{
    dayOfWeek: { type: Number, enum: [0,1,2,3,4,5,6], required: true }, // 0=Sun, 6=Sat
    slots: [{
      startTime: { type: String, required: true }, // "09:00"
      endTime: { type: String, required: true }     // "10:00"
    }]
  }],
  blockedDates: [{ type: Date }] // vacation, holidays
}, { timestamps: true });

module.exports = mongoose.model('Availability', AvailabilitySchema);
