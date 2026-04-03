const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['solo', 'group'], required: true },
  durationMinutes: { type: Number, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'INR', required: true },
  mode: { type: String, enum: ['online', 'offline', 'both'], required: true },
  onlineLink: { type: String }, // Zoom/Meet URL
  offlineAddress: { type: String },
  maxCapacity: { type: Number, default: 1 }, // Used for group sessions
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
