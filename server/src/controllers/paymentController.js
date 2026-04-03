const paymentService = require('../services/PaymentService');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Create Razorpay order
const createOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate('sessionId');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

    const order = await paymentService.createOrder({ _id: booking._id, session: booking.sessionId });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};

// Verify Razorpay payment (webhook)
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const isValid = paymentService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }

    // Update payment record
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (payment) {
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.status = 'paid';
      payment.paidAt = new Date();
      await payment.save();
    }

    // Update booking
    const booking = await Booking.findOne({ razorpayOrderId: razorpay_order_id });
    if (booking) {
      booking.razorpayPaymentId = razorpay_payment_id;
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      await booking.save();
    }

    res.json({ success: true });
  } catch (err) { next(err); }
};

// Get receipt
const getReceipt = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ bookingId: req.params.bookingId });
    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (err) { next(err); }
};

module.exports = { createOrder, verifyPayment, getReceipt };
