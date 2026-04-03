const { google } = require('googleapis');

class CalendarService {
  _getAuth(user) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken
    });
    return oauth2Client;
  }

  async addEvent(booking, session, user) {
    if (!user.googleAccessToken) {
      console.log('[CalendarService] No Google token — skipping calendar sync.');
      return null;
    }

    try {
      const auth = this._getAuth(user);
      const calendar = google.calendar({ version: 'v3', auth });

      const endTime = new Date(
        new Date(booking.scheduledAt).getTime() + session.durationMinutes * 60000
      );

      const event = {
        summary: session.title,
        description: session.description || '',
        start: { dateTime: new Date(booking.scheduledAt).toISOString() },
        end: { dateTime: endTime.toISOString() },
        location: session.mode === 'offline'
          ? session.offlineAddress
          : session.onlineLink || '',
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 60 },
            { method: 'email', minutes: 1440 }
          ]
        }
      };

      const created = await calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      return created.data.id;
    } catch (err) {
      console.error('[CalendarService] addEvent failed:', err.message);
      return null;
    }
  }

  async deleteEvent(user, eventId) {
    if (!user.googleAccessToken || !eventId) return;

    try {
      const auth = this._getAuth(user);
      const calendar = google.calendar({ version: 'v3', auth });
      await calendar.events.delete({ calendarId: 'primary', eventId });
    } catch (err) {
      console.error('[CalendarService] deleteEvent failed:', err.message);
    }
  }
}

module.exports = new CalendarService();
