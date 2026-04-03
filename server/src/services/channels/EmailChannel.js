class EmailChannel {
  constructor() {
    this.resend = null;
    const key = process.env.RESEND_API_KEY;

    // Only initialize Resend when real credentials are provided
    if (key && key !== 'test_resend' && !key.startsWith('test')) {
      try {
        const { Resend } = require('resend');
        this.resend = new Resend(key);
      } catch (err) {
        console.warn('WARN: Resend init failed:', err.message);
      }
    }
  }

  async send(to, subject, body) {
    if (!this.resend) {
      console.log(`[Mock Email] To: ${to} | Subject: ${subject}`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: process.env.EMAIL_FROM || 'Take Your Time <onboarding@resend.dev>',
        to,
        subject,
        html: body
      });
    } catch (err) {
      console.error('Email send failed:', err.message);
    }
  }
}

module.exports = EmailChannel;
