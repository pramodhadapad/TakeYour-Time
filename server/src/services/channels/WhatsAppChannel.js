class WhatsAppChannel {
  constructor() {
    this.client = null;
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;

    // Only initialize Twilio when real credentials are provided
    if (sid && token && sid !== 'test_sid' && !sid.startsWith('test')) {
      try {
        const twilio = require('twilio');
        this.client = twilio(sid, token);
        this.from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
      } catch (err) {
        console.warn('WARN: Twilio init failed:', err.message);
      }
    }
  }

  async send(toPhone, subject, body) {
    if (!this.client) {
      console.log(`[Mock WhatsApp] To: ${toPhone} | Subject: ${subject}`);
      return;
    }

    if (!toPhone) return;

    try {
      await this.client.messages.create({
        from: this.from,
        to: `whatsapp:${toPhone}`,
        body: `*${subject}*\n\n${body}`
      });
    } catch (err) {
      console.error('WhatsApp send failed:', err.message);
    }
  }
}

module.exports = WhatsAppChannel;
