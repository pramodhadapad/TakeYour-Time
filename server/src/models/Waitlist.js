const mongoose = require('mongoose');

const WaitlistSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true }, // which date/slot they want
  notified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Waitlist', WaitlistSchema);
