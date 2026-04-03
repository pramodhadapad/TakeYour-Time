const Booking = require('../models/Booking');
const notificationService = require('./NotificationService');
const User = require('../models/User');

class ReminderService {
  async send24HourReminders() {
    const now = new Date();
    const in23h = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const bookings = await Booking.find({
      scheduledAt: { $gte: in23h, $lte: in25h },
      status: 'confirmed',
      reminder24Sent: false
    }).populate('sessionId studentId tutorId');

    for (const booking of bookings) {
      const msg = `Reminder: Your session "${booking.sessionId.title}" is tomorrow at ${new Date(booking.scheduledAt).toLocaleTimeString()}.`;
      
      await notificationService.notify(booking.studentId, '24-Hour Reminder', msg);
      await notificationService.notify(booking.tutorId, 'Upcoming Session Alert', msg);

      booking.reminder24Sent = true;
      await booking.save();
    }

    if (bookings.length > 0) {
      console.log(`[ReminderService] Sent 24hr reminders for ${bookings.length} bookings.`);
    }
  }

  async send1HourReminders() {
    const now = new Date();
    const in55m = new Date(now.getTime() + 55 * 60 * 1000);
    const in65m = new Date(now.getTime() + 65 * 60 * 1000);

    const bookings = await Booking.find({
      scheduledAt: { $gte: in55m, $lte: in65m },
      status: 'confirmed',
      reminder1Sent: false
    }).populate('sessionId studentId tutorId');

    for (const booking of bookings) {
      const msg = `Reminder: Your session "${booking.sessionId.title}" starts in 1 hour!`;

      await notificationService.notify(booking.studentId, '1-Hour Reminder', msg);
      await notificationService.notify(booking.tutorId, 'Session Starting Soon', msg);

      booking.reminder1Sent = true;
      await booking.save();
    }

    if (bookings.length > 0) {
      console.log(`[ReminderService] Sent 1hr reminders for ${bookings.length} bookings.`);
    }
  }
}

module.exports = new ReminderService();
