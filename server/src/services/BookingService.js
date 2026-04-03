const Booking = require('../models/Booking');
const Session = require('../models/Session');
const User = require('../models/User');
const Availability = require('../models/Availability');
const AvailabilitySlot = require('../models/AvailabilitySlot');
const Payment = require('../models/Payment');
const calendarService = require('./CalendarService');
const notificationService = require('./NotificationService');
const paymentService = require('./PaymentService');

class BookingService {

  async getAvailableSlots(tutorId, dateStr, sessionId) {
    // Only return future slots that are not full
    // Added a 15-minute grace period to prevent slots from disappearing while the user is browsing
    const graceTime = new Date(Date.now() - 15 * 60000);

    const query = {
      tutorId,
      startTime: { $gt: graceTime },
      $expr: { $lt: ['$bookedCount', '$capacity'] }
    };

    if (sessionId) {
      query.sessionId = sessionId;
    }
    
    // Optionally filter by exact date if dateStr provided
    if (dateStr) {
      const startOfDay = new Date(dateStr); startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateStr); endOfDay.setHours(23, 59, 59, 999);
      query.startTime.$gte = startOfDay;
      query.startTime.$lte = endOfDay;
    }
    
    const slots = await AvailabilitySlot.find(query).sort({ startTime: 1 });
    return slots;
  }

  async createBooking(bookingData) {
    const { sessionId, studentId, slotId, paymentMethod } = bookingData;

    const session = await Session.findById(sessionId).populate('tutorId');
    if (!session || !session.isActive) {
      throw Object.assign(new Error('Session not found or inactive'), { status: 404 });
    }

    const slot = await AvailabilitySlot.findById(slotId);
    if (!slot) {
      throw Object.assign(new Error('Slot not found'), { status: 404 });
    }

    // Check strict capacity
    if (slot.bookedCount >= slot.capacity) {
      throw Object.assign(new Error('Session slot is fully booked.'), { status: 409 });
    }

    const tutor = await User.findById(session.tutorId);

    // Create booking
    const booking = await Booking.create({
      sessionId,
      tutorId: session.tutorId._id || session.tutorId,
      studentId,
      slotId,
      scheduledAt: slot.startTime,
      paymentMethod,
      status: paymentMethod === 'offline' ? 'confirmed' : 'pending',
      paymentStatus: paymentMethod === 'offline' ? 'unpaid' : 'unpaid'
    });

    // Increment bookedCount
    slot.bookedCount += 1;
    await slot.save();

    // Create payment record
    let razorpayOrder = null;
    if (paymentMethod === 'online') {
      razorpayOrder = await paymentService.createOrder({ _id: booking._id, session });
      if (razorpayOrder) {
        booking.razorpayOrderId = razorpayOrder.id;
        await booking.save();
      }

      await Payment.create({
        bookingId: booking._id,
        studentId,
        tutorId: session.tutorId._id || session.tutorId,
        amount: session.price,
        razorpayOrderId: razorpayOrder ? razorpayOrder.id : null,
        status: 'created'
      });
    }

    // Calendar sync (non-blocking — don't fail the booking if this errors)
    try {
      const calEventId = await calendarService.addEvent(booking, session, tutor);
      if (calEventId) {
        booking.googleCalEventId = calEventId;
        await booking.save();
      }
    } catch (err) {
      console.error('[BookingService] Calendar sync skipped:', err.message);
    }

    // Send professional confirmation emails to both student and tutor
    const student = await User.findById(studentId);
    const { bookingConfirmationStudent, bookingNotificationTutor } = require('./emailTemplates');

    const emailData = {
      studentName: student.name,
      studentEmail: student.email,
      tutorName: tutor.name,
      tutorEmail: tutor.email,
      sessionTitle: session.title,
      scheduledAt: booking.scheduledAt,
      duration: session.durationMinutes,
      mode: session.mode,
      location: session.mode === 'online' ? session.onlineLink : session.offlineAddress,
      price: session.price,
      currency: session.currency,
      bookingId: booking._id.toString().slice(-8).toUpperCase()
    };

    // Email to STUDENT — Booking Confirmation
    notificationService.notify(student, '✅ Booking Confirmed — ' + session.title, bookingConfirmationStudent(emailData));

    // Email to TUTOR — New Booking Alert
    notificationService.notify(tutor, '📚 New Booking from ' + student.name, bookingNotificationTutor(emailData));

    return { booking, razorpayOrder };
  }

  async cancelBooking(bookingId, userId) {
    const booking = await Booking.findById(bookingId).populate('sessionId');
    if (!booking) {
      throw Object.assign(new Error('Booking not found'), { status: 404 });
    }

    if (booking.status === 'cancelled') {
      throw Object.assign(new Error('Booking already cancelled'), { status: 400 });
    }

    // Check cancellation policy
    const tutor = await User.findById(booking.tutorId);
    const cancellationHours = tutor.tutorProfile?.cancellationHours || 24;
    const hoursUntilSession = (new Date(booking.scheduledAt) - Date.now()) / (1000 * 60 * 60);

    if (hoursUntilSession < cancellationHours) {
      throw Object.assign(
        new Error(`Cannot cancel within ${cancellationHours} hours of session`),
        { status: 400 }
      );
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelledBy = userId;
    await booking.save();

    // Release the slot
    if (booking.slotId) {
      await AvailabilitySlot.updateOne(
        { _id: booking.slotId },
        { $inc: { bookedCount: -1 } }
      );
    }

    // Delete calendar event
    await calendarService.deleteEvent(tutor, booking.googleCalEventId);

    // Notify
    const student = await User.findById(booking.studentId);
    notificationService.notify(tutor, 'Booking Cancelled', `Booking for ${booking.sessionId.title} on ${new Date(booking.scheduledAt).toLocaleString()} has been cancelled.`);
    notificationService.notify(student, 'Booking Cancelled', `Your booking for ${booking.sessionId.title} on ${new Date(booking.scheduledAt).toLocaleString()} has been cancelled.`);

    return booking;
  }
}

module.exports = new BookingService();
