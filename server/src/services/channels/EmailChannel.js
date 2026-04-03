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
      console.log(`[Mock Email Sender] (Development Mode)
        To: ${to}
        Subject: ${subject}
        Hint: To send real emails, provide a valid RESEND_API_KEY in server/.env`);
      return;
    }

    try {
      const from = process.env.EMAIL_FROM || 'Take Your Time <onboarding@resend.dev>';
      const result = await this.resend.emails.send({
        from,
        to,
        subject,
        html: body
      });

      if (result.error) {
        throw new Error(result.error.message || 'Resend internal error');
      }

      console.log(`[Notification Service] Email sent successfully via Resend. To: ${to}, ID: ${result.data?.id}`);
    } catch (err) {
      console.error(`[Notification Service Error] FAILED to send email to ${to}:`, err.message);
      if (err.message.includes('onboarding@resend.dev')) {
        console.warn(`[Notification Service Hint] You are using onboarding@resend.dev. Resend only allows sending to your own account email for testing unless you verify a domain.`);
      }
    }
  }
}

module.exports = EmailChannel;
