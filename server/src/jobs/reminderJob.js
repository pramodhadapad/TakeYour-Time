const cron = require('node-cron');
const reminderService = require('../services/ReminderService');

// Run every 5 minutes — send 24 hour reminders
cron.schedule('*/5 * * * *', async () => {
  try {
    await reminderService.send24HourReminders();
  } catch (err) {
    console.error('[CRON] 24hr reminder error:', err);
  }
});

// Run every 5 minutes — send 1 hour reminders
cron.schedule('*/5 * * * *', async () => {
  try {
    await reminderService.send1HourReminders();
  } catch (err) {
    console.error('[CRON] 1hr reminder error:', err);
  }
});

console.log('[CRON] Reminder jobs scheduled.');
