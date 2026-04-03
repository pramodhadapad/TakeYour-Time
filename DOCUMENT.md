# DOCUMENT.md — Take Your Time
### Developer Documentation, Data Flows & Integration Guide · v1.0 · April 2026

---

## 1. Project Overview

**Take Your Time** is a two-sided SaaS booking platform for independent tutors and their students. Tutors define their availability and session types; students discover, book, pay, and attend sessions — all from a single platform.

This document covers: data flow diagrams, integration guides (Google OAuth, Razorpay, Google Calendar, Resend, Twilio), booking lifecycle, and developer setup.

---

## 2. System Architecture Overview

```
                        ┌─────────────────────────────────┐
                        │         VERCEL (Frontend)        │
                        │   React 18 + Vite + Tailwind    │
                        │  Landing | BookingPage | Dashboards │
                        └───────────────┬─────────────────┘
                                        │ HTTPS REST API
                        ┌───────────────▼─────────────────┐
                        │       RENDER (Backend)           │
                        │    Node.js + Express.js          │
                        │  Controllers → Services → Models │
                        └──┬────────┬──────────┬──────────┘
                           │        │          │
              ┌────────────▼┐  ┌────▼────┐  ┌─▼──────────┐
              │ MongoDB     │  │ Google  │  │  External   │
              │ Atlas (M0)  │  │ OAuth   │  │  Services   │
              │             │  │ Calendar│  │  Resend     │
              │ 6 collections│  │ API     │  │  Twilio     │
              └─────────────┘  └─────────┘  │  Razorpay   │
                                            │  Sentry     │
                                            └─────────────┘
```

---

## 3. Data Flow Diagrams

### 3.1 Authentication Flow (Google OAuth)

```
Student opens /login
        │
        ▼
[Google Sign-In Button clicked]
        │
        ▼
Redirect → Google OAuth Consent Screen
        │
        ▼
Google redirects to /api/auth/google/callback
        │
        ▼
Passport.js receives { googleId, email, name, avatar }
        │
        ├─── User exists? → Load user from MongoDB
        │
        └─── New user? → Create user doc { role: 'student' }
                              │
                              ▼
                   Issue JWT (access 1h) + Refresh Token (7d)
                              │
                              ▼
              Return tokens → Frontend stores in memory (Zustand)
              Refresh token → httpOnly cookie
                              │
                              ▼
              Auto-redirect based on role:
              role=tutor → /tutor/dashboard
              role=student → /student/dashboard
```

---

### 3.2 Booking Creation Flow

```
Student visits /book/:tutorSlug
        │
        ▼
GET /api/public/:slug → Tutor profile + session types
        │
        ▼
Student picks session type + date
        │
        ▼
GET /api/public/:slug/availability?date=YYYY-MM-DD
  → Backend checks Availability doc + existing Bookings
  → Returns free slots array
        │
        ▼
Student selects slot → Booking summary appears
        │
        ▼
Student chooses payment method:
  ┌─── Online (Razorpay) ────────────────────────────────┐
  │    POST /api/payments/create-order                   │
  │      → Razorpay order created                        │
  │      → Frontend opens Razorpay checkout modal        │
  │      → Student pays                                  │
  │      → Razorpay fires webhook → /api/payments/verify │
  │      → Signature verified → payment.status = 'paid'  │
  │      → Booking.status = 'confirmed'                  │
  └──────────────────────────────────────────────────────┘
  ┌─── Offline ──────────────────────────────────────────┐
  │    POST /api/public/:slug/book { paymentMethod: 'offline' }
  │      → Booking.status = 'confirmed'                  │
  │      → Payment.status = 'unpaid'                     │
  └──────────────────────────────────────────────────────┘
        │
        ▼
BookingService.createBooking() runs:
  1. Persist Booking to MongoDB
  2. CalendarService.addEvent() → Google Calendar (tutor + student)
  3. NotificationService.notify() → Email (Resend) + WhatsApp (Twilio)
  4. ReminderService.scheduleReminders() → Register for cron pickup
        │
        ▼
Student → BookingConfirmation screen
Tutor  → Receives email + WhatsApp notification
```

---

### 3.3 Reminder Delivery Flow

```
node-cron runs every 5 minutes
        │
        ▼
ReminderService.send24HourReminders()
  → Query: bookings where scheduledAt is between now+23h and now+25h
    AND reminder24Sent = false
  → For each booking:
      → NotificationService.notify(student, '24hr reminder')
      → NotificationService.notify(tutor, 'Upcoming session alert')
      → Set reminder24Sent = true
        │
ReminderService.send1HourReminders()
  → Query: bookings where scheduledAt is between now+55min and now+65min
    AND reminder1Sent = false
  → Same dispatch + flag pattern
```

---

### 3.4 Cancellation Flow

```
Student clicks Cancel on /student/dashboard
        │
        ▼
POST /api/student/bookings/:id/cancel
        │
        ▼
BookingService.cancelBooking():
  1. Check: scheduledAt - now > cancellationHours? 
     NO  → Return 400: "Cannot cancel within X hours"
     YES → Continue
  2. Update booking.status = 'cancelled', cancelledAt, cancelledBy
  3. If paymentMethod = 'online' AND paymentStatus = 'paid':
       → Trigger Razorpay refund (or mark pending manual refund)
  4. CalendarService.deleteEvent() → Remove from both calendars
  5. NotificationService.notify() → Cancellation email + WhatsApp
  6. WaitlistService.notifyNextInLine(sessionId, scheduledAt)
       → First waitlisted student gets notified
```

---

### 3.5 Waitlist Flow

```
Student tries to book a full group session
        │
        ▼
BookingService detects: session.maxCapacity reached for this slot
        │
        ▼
Frontend shows WaitlistJoinModal
        │
        ▼
POST /api/student/waitlist { sessionId, scheduledAt }
  → Waitlist doc created { studentId, sessionId, scheduledAt, notified: false }
        │
        ▼
--- Later: A booking is cancelled ---
        │
        ▼
WaitlistService.notifyNextInLine(sessionId, scheduledAt)
  → Find oldest waitlist entry for that session + date
  → NotificationService.notify() → "A spot opened up! Book now"
  → Set waitlist.notified = true
  → Student has 2 hours to book before next in line is notified
```

---

## 4. Integration Guides

### 4.1 Google OAuth Setup

**Packages:** `passport`, `passport-google-oauth20`, `express-session`

```js
// config/passport.js
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    user = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value,
      role: 'student',
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken
    });
  } else {
    user.googleAccessToken = accessToken;  // always refresh token
    await user.save();
  }
  return done(null, user);
}));
```

**Routes:**
```js
router.get('/google', passport.authenticate('google'));
router.get('/google/callback', passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = generateJWT(req.user);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);
```

---

### 4.2 Razorpay Integration

**Package:** `razorpay`

**Create Order (Backend):**
```js
// services/PaymentService.js
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

async createOrder(booking) {
  const order = await razorpay.orders.create({
    amount: booking.price * 100,  // paise
    currency: 'INR',
    receipt: `rcpt_${booking._id}`,
    notes: { bookingId: booking._id.toString() }
  });
  return order;
}
```

**Webhook Verification:**
```js
// Razorpay sends: razorpay_order_id, razorpay_payment_id, razorpay_signature
const crypto = require('crypto');
const expectedSig = crypto
  .createHmac('sha256', process.env.RAZORPAY_SECRET)
  .update(`${order_id}|${payment_id}`)
  .digest('hex');

if (expectedSig !== razorpay_signature) {
  return res.status(400).json({ error: 'Invalid signature' });
}
// Verified → update payment + booking status
```

---

### 4.3 Resend (Email) Integration

**Package:** `resend`

```js
// channels/EmailChannel.js
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async send(to, subject, htmlBody) {
  await resend.emails.send({
    from: 'Take Your Time <noreply@takeyourtime.app>',
    to,
    subject,
    html: htmlBody
  });
}
```

**Email Templates:**
| Template | Trigger |
|----------|---------|
| `booking-confirmed.html` | Booking creation |
| `booking-cancelled.html` | Cancellation |
| `reminder-24hr.html` | 24hr cron job |
| `reminder-1hr.html` | 1hr cron job |
| `waitlist-spot-open.html` | Slot freed |
| `new-booking-tutor.html` | New booking alert to tutor |

---

### 4.4 Twilio WhatsApp Integration

**Package:** `twilio`

```js
// channels/WhatsAppChannel.js
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async send(toPhone, subject, body) {
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,  // whatsapp:+14155238886 (sandbox)
    to: `whatsapp:${toPhone}`,
    body: `*${subject}*\n\n${body}`
  });
}
```

**Note:** In production, migrate from Twilio Sandbox to approved WhatsApp Business number. Message templates must be pre-approved by Meta.

---

### 4.5 Google Calendar API Integration

**Package:** `googleapis`

```js
// services/CalendarService.js
const { google } = require('googleapis');

async addEvent(booking, user) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken
  });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary: booking.session.title,
    description: booking.session.description,
    start: { dateTime: booking.scheduledAt.toISOString() },
    end: { dateTime: new Date(booking.scheduledAt.getTime()
             + booking.session.durationMinutes * 60000).toISOString() },
    location: booking.session.mode === 'offline'
      ? booking.session.offlineAddress
      : booking.session.onlineLink,
    reminders: { useDefault: false, overrides: [
      { method: 'popup', minutes: 60 },
      { method: 'email', minutes: 1440 }
    ]}
  };

  const created = await calendar.events.insert({
    calendarId: 'primary',
    resource: event
  });
  return created.data.id;  // store as googleCalEventId
}
```

---

### 4.6 Sentry Error Tracking

**Packages:** `@sentry/node` (backend), `@sentry/react` (frontend)

**Backend init (app.js):**
```js
const Sentry = require('@sentry/node');
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.2
});
app.use(Sentry.Handlers.requestHandler());
// ... routes ...
app.use(Sentry.Handlers.errorHandler());  // must be before custom error handler
```

**Frontend init (main.jsx):**
```js
import * as Sentry from '@sentry/react';
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.2
});
```

---

## 5. Booking Lifecycle State Machine

```
                    ┌──────────┐
                    │ PENDING  │  ← Created, payment not yet complete (online flow)
                    └────┬─────┘
                         │  Payment verified / offline booking
                         ▼
                    ┌──────────┐
                    │CONFIRMED │  ← Live booking, reminders scheduled
                    └────┬─────┘
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │CANCELLED │   │COMPLETED │   │ NO_SHOW  │
    │(by student│  │(session   │  │(tutor    │
    │ or tutor) │  │ attended) │  │ marks)   │
    └──────────┘   └──────────┘   └──────────┘
```

---

## 6. Role & Route Guard Reference

| Route Prefix | Guard | Description |
|-------------|-------|-------------|
| `/api/public/*` | None | Open to all |
| `/api/auth/*` | None | Auth endpoints |
| `/api/student/*` | `requireAuth` + `requireStudent` | Student-only |
| `/api/tutor/*` | `requireAuth` + `requireTutor` | Tutor-only |
| `/api/payments/*` | `requireAuth` | Any authenticated user |

**Frontend route guards (React Router):**
```jsx
// ProtectedRoute.jsx
const ProtectedRoute = ({ role, children }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/unauthorized" />;
  return children;
};

// Usage
<Route path="/tutor/*" element={<ProtectedRoute role="tutor"><TutorLayout /></ProtectedRoute>} />
<Route path="/student/*" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>} />
```

---

## 7. Error Handling Standards

### Backend — Global Error Handler
```js
// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.isOperational
    ? err.message
    : 'An unexpected error occurred';  // never leak stack trace

  if (status >= 500) {
    Sentry.captureException(err);
    console.error('[SERVER ERROR]', err);
  }

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### Standard API Response Shape
```js
// Success
{ success: true, data: { ... } }

// Error
{ success: false, error: "Human-readable message" }

// Paginated
{ success: true, data: [...], pagination: { page, limit, total, hasMore } }
```

---

## 8. Local Development Setup

```bash
# 1. Clone & install
git clone https://github.com/pramodhadapad/take-your-time
cd take-your-time

# Frontend
cd client && npm install
cp .env.example .env   # fill in values
npm run dev            # runs on localhost:5173

# Backend
cd ../server && npm install
cp .env.example .env   # fill in values
npm run dev            # runs on localhost:5000 (nodemon)
```

**Required accounts (all free):**
- MongoDB Atlas (M0 free cluster)
- Google Cloud Console (OAuth + Calendar API enabled)
- Razorpay test mode
- Resend account (free tier)
- Twilio account + WhatsApp Sandbox
- Sentry project (free tier)

---

## 9. Testing Strategy

| Layer | Tool | Coverage Target |
|-------|------|----------------|
| Unit (services) | Jest | BookingService, NotificationService, PaymentService |
| API integration | Supertest | All route happy paths + error cases |
| Frontend component | React Testing Library | Booking flow, auth redirect |
| E2E (optional) | Playwright | Full book → pay → confirm journey |

**Key test cases:**
- Booking within policy window → success
- Booking cancellation within X hours → 400 error
- Razorpay signature mismatch → 400 error
- Google Calendar token expiry → auto-refresh or graceful failure
- Reminder cron: no duplicate sends (idempotency via flag)

---

## 10. Changelog

| Version | Date | Notes |
|---------|------|-------|
| v1.0 | April 2026 | Initial documentation |

---

_Document Owner: Pramod | Last Updated: April 2026 | Version: 1.0_
