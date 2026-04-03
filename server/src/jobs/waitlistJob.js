const cron = require('node-cron');
const waitlistService = require('../services/WaitlistService');
const Booking = require('../models/Booking');
const Session = require('../models/Session');

// Run every minute — check waitlist for freed slots
cron.schedule('* * * * *', async () => {
  try {
    // Find recently cancelled bookings for group sessions that have waitlisted students
    const recentlyCancelled = await Booking.find({
      status: 'cancelled',
      cancelledAt: { $gte: new Date(Date.now() - 2 * 60 * 1000) } // last 2 minutes
    });

    for (const booking of recentlyCancelled) {
      const session = await Session.findById(booking.sessionId);
      if (session && session.type === 'group') {
        await waitlistService.notifyNextInLine(booking.sessionId, booking.scheduledAt);
      }
    }
  } catch (err) {
    console.error('[CRON] Waitlist job error:', err);
  }
});

console.log('[CRON] Waitlist job scheduled.');
