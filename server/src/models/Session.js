const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Tutor identification is required'] },
  title: { type: String, required: [true, 'Class title is required'] },
  description: { type: String },
  type: { type: String, enum: { values: ['solo', 'group'], message: '{VALUE} is not a valid class type' }, required: [true, 'Class type (solo/group) is required'] },
  durationMinutes: { type: Number, required: [true, 'Duration is required'], min: [5, 'Duration must be at least 5 minutes'] },
  price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
  currency: { type: String, default: 'INR', required: [true, 'Currency is required'] },
  mode: { type: String, enum: { values: ['online', 'offline', 'both'], message: '{VALUE} is not a valid mode' }, required: [true, 'Teaching mode is required'] },
  onlineLink: { type: String }, // Zoom/Meet URL
  offlineAddress: { type: String },
  maxCapacity: { type: Number, default: 1, min: [1, 'Capacity must be at least 1'] }, // Used for group sessions
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
