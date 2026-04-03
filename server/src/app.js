const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const Sentry = require('@sentry/node');

const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/booking.routes');
const sessionRoutes = require('./routes/session.routes');
const paymentRoutes = require('./routes/payment.routes');
const reviewRoutes = require('./routes/review.routes');
const slotRoutes = require('./routes/slot.routes');
const tutorRoutes = require('./routes/tutor.routes');
const adminRoutes = require('./routes/admin.routes');
const errorHandler = require('./middlewares/errorHandler');
require('./config/passport'); // Initialize passport config

// Initialize cron jobs
require('./jobs/reminderJob');
require('./jobs/waitlistJob');

const app = express();

// Sentry observability — only initialize with a real DSN
const sentryDsn = process.env.SENTRY_DSN;
if (sentryDsn && sentryDsn !== 'test_sentry' && !sentryDsn.startsWith('test')) {
  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 0.3,
    environment: process.env.NODE_ENV || 'development'
  });
  app.use(Sentry.Handlers.requestHandler());
}

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 5000 // relax heavily for development
});
app.use(limiter);

app.use(express.json());
app.use(passport.initialize());

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', bookingRoutes);
app.use('/api/tutor', sessionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/admin', adminRoutes);

// Sentry error handler (before global error handler)
if (sentryDsn && sentryDsn !== 'test_sentry' && !sentryDsn.startsWith('test')) {
  app.use(Sentry.Handlers.errorHandler());
}

// Global error handler
app.use(errorHandler);

module.exports = app;
