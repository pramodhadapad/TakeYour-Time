const crypto = require('crypto');

class PaymentService {
  constructor() {
    this.razorpay = null;
    const keyId = process.env.RAZORPAY_KEY_ID;
    const secret = process.env.RAZORPAY_SECRET;

    // Only initialize Razorpay when real credentials are provided
    if (keyId && secret && keyId !== 'test_key' && !keyId.startsWith('test')) {
      try {
        const Razorpay = require('razorpay');
        this.razorpay = new Razorpay({ key_id: keyId, key_secret: secret });
      } catch (err) {
        console.warn('WARN: Razorpay init failed:', err.message);
      }
    }

    if (!this.razorpay) {
      console.log('INFO: PaymentService running in mock mode (no Razorpay credentials)');
    }
  }

  async createOrder(booking) {
    if (!this.razorpay) return { id: `mock_order_${booking._id}` };

    const amount = booking.session && booking.session.price ? booking.session.price * 100 : 0;
    if (amount <= 0) return null;

    const order = await this.razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `rcpt_${booking._id}`,
      notes: { bookingId: booking._id.toString() }
    });

    return order;
  }

  verifySignature(orderId, paymentId, signature) {
    if (!this.razorpay) return true; // mock mode — always pass

    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return expectedSig === signature;
  }
}

module.exports = new PaymentService();
