const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'AvailabilitySlot', required: true },
  scheduledAt: { type: Date, required: true }, // exact datetime of session
  status: { type: String, enum: ['pending','confirmed','cancelled','completed','no_show'], default: 'pending' },
  paymentMethod: { type: String, enum: ['online','offline'], required: true },
  paymentStatus: { type: String, enum: ['paid','unpaid','refunded'], default: 'unpaid' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  isRecurring: { type: Boolean, default: false },
  recurringRule: { type: String }, // cron expression e.g. "0 17 * * 1" (Mon 5pm)
  cancelledAt: { type: Date },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cancellationReason: { type: String },
  googleCalEventId: { type: String }, // tutor's GCal event ID
  studentGCalEventId: { type: String }, // student's GCal event ID
  reminder24Sent: { type: Boolean, default: false },
  reminder1Sent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
