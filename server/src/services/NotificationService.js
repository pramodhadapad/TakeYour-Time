const EmailChannel = require('./channels/EmailChannel');
const WhatsAppChannel = require('./channels/WhatsAppChannel');

class NotificationService {
  constructor(channels = []) {
    this.channels = channels;
  }

  async notify(user, subject, body) {
    if (!user) return;
    
    // We expect user object to potentially have email or phone depending on needed notifications
    const promises = [];

    for (const channel of this.channels) {
      if (channel instanceof EmailChannel && user.email) {
        promises.push(channel.send(user.email, subject, body));
      } else if (channel instanceof WhatsAppChannel && user.phone) {
        promises.push(channel.send(user.phone, subject, body));
      }
    }

    try {
      await Promise.all(promises);
    } catch (err) {
      console.error('Error in NotificationService notify():', err);
    }
  }
}

// Export a default composed instance
module.exports = new NotificationService([
  new EmailChannel(),
  new WhatsAppChannel()
]);
