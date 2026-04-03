const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const { createOrder, verifyPayment, getReceipt } = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-order', requireAuth, createOrder);
router.post('/verify', verifyPayment); // Webhook — no auth
router.get('/:bookingId', requireAuth, getReceipt);

module.exports = router;
