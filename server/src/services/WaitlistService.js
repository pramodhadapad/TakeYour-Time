const Waitlist = require('../models/Waitlist');
const Booking = require('../models/Booking');
const notificationService = require('./NotificationService');
const User = require('../models/User');

class WaitlistService {
  async joinWaitlist(studentId, sessionId, scheduledAt) {
    const existing = await Waitlist.findOne({ studentId, sessionId, scheduledAt: new Date(scheduledAt) });
    if (existing) {
      throw Object.assign(new Error('Already on the waitlist for this slot'), { status: 400 });
    }

    const entry = await Waitlist.create({
      studentId,
      sessionId,
      scheduledAt: new Date(scheduledAt)
    });

    return entry;
  }

  async notifyNextInLine(sessionId, scheduledAt) {
    const nextEntry = await Waitlist.findOne({
      sessionId,
      scheduledAt: new Date(scheduledAt),
      notified: false
    }).sort({ createdAt: 1 }); // oldest first

    if (!nextEntry) return null;

    const student = await User.findById(nextEntry.studentId);
    if (student) {
      await notificationService.notify(student, 'A Spot Opened Up!',
        `Great news! A spot has opened up for your waitlisted session. Book now before someone else does — you have 2 hours.`
      );
    }

    nextEntry.notified = true;
    await nextEntry.save();

    return nextEntry;
  }
}

module.exports = new WaitlistService();
