# TECH_STACK.md — Take Your Time
### Technology Stack, Architecture & SOLID Design Decisions · v1.0 · April 2026

---

## 1. Stack at a Glance

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React 18 + Vite | Fast builds, familiar, HMR |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, rapid UI |
| State Management | Zustand | Lightweight, no boilerplate |
| Backend | Node.js + Express.js | Known stack, fast API dev |
| Database | MongoDB Atlas (M0 free) | Flexible schema, cloud-managed |
| ODM | Mongoose | Schema validation + hooks |
| Auth | Google OAuth 2.0 + JWT | Frictionless, secure |
| Payments | Razorpay | India-first, free to set up |
| Email | Resend (free tier) | 3000 emails/month, clean API |
| WhatsApp | Twilio Sandbox | Free for dev, production-ready path |
| Job Scheduler | node-cron | Lightweight, same server |
| Cal Sync | Google Calendar API | Two-way sync for tutor + student |
| Error Tracking | Sentry (free tier) | Full-stack crash reporting |
| Frontend Deploy | Vercel | Zero-config, instant |
| Backend Deploy | Render (free tier) | Familiar, managed Node hosting |
| Uptime Monitor | UptimeRobot | Prevents Render cold starts |

---

## 2. Project Directory Structure

```
take-your-time/
├── client/                          # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn base components
│   │   │   ├── booking/             # BookingCard, SlotPicker, etc.
│   │   │   ├── dashboard/           # StatCard, CalendarView, etc.
│   │   │   └── shared/              # Navbar, Footer, Modals
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── BookingPage.jsx      # Public /book/:slug
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Upcoming.jsx
│   │   │   │   ├── History.jsx
│   │   │   │   └── Receipts.jsx
│   │   │   └── tutor/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Calendar.jsx
│   │   │       ├── Sessions.jsx
│   │   │       ├── Students.jsx
│   │   │       └── Analytics.jsx
│   │   ├── store/                   # Zustand stores
│   │   │   ├── authStore.js
│   │   │   ├── bookingStore.js
│   │   │   └── notificationStore.js
│   │   ├── services/                # API call wrappers (Axios)
│   │   │   ├── authService.js
│   │   │   ├── bookingService.js
│   │   │   └── sessionService.js
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── utils/
│   │   └── App.jsx
│   ├── .env
│   └── vite.config.js
│
└── server/                          # Node + Express backend
    ├── src/
    │   ├── config/
    │   │   ├── db.js                # MongoDB connection
    │   │   ├── passport.js          # Google OAuth strategy
    │   │   └── sentry.js            # Sentry init
    │   ├── models/                  # Mongoose schemas
    │   │   ├── User.js
    │   │   ├── Session.js
    │   │   ├── Booking.js
    │   │   ├── Review.js
    │   │   ├── Payment.js
    │   │   └── Waitlist.js
    │   ├── controllers/             # Route handlers (thin controllers)
    │   │   ├── authController.js
    │   │   ├── bookingController.js
    │   │   ├── sessionController.js
    │   │   ├── reviewController.js
    │   │   └── paymentController.js
    │   ├── services/                # Business logic layer (SOLID: SRP)
    │   │   ├── BookingService.js
    │   │   ├── NotificationService.js
    │   │   ├── PaymentService.js
    │   │   ├── CalendarService.js
    │   │   ├── ReminderService.js
    │   │   └── WaitlistService.js
    │   ├── routes/
    │   │   ├── auth.routes.js
    │   │   ├── booking.routes.js
    │   │   ├── session.routes.js
    │   │   ├── review.routes.js
    │   │   └── payment.routes.js
    │   ├── middlewares/
    │   │   ├── authMiddleware.js    # JWT verify
    │   │   ├── roleMiddleware.js    # Tutor/Student guard
    │   │   ├── rateLimiter.js       # express-rate-limit
    │   │   ├── errorHandler.js      # Global error middleware
    │   │   └── validate.js          # Joi/Zod request validation
    │   ├── jobs/                    # node-cron scheduled tasks
    │   │   ├── reminderJob.js       # 24hr + 1hr reminders
    │   │   └── waitlistJob.js       # Notify on slot open
    │   └── app.js
    ├── .env
    └── server.js
```

---

## 3. SOLID Principles Applied

### S — Single Responsibility Principle
> Every module does ONE thing and does it well.

```
✅ BookingService.js     — only handles booking creation/cancellation logic
✅ NotificationService.js — only handles email + WhatsApp dispatch
✅ ReminderService.js    — only manages cron-triggered reminder timing
✅ CalendarService.js    — only handles Google Calendar API calls
✅ PaymentService.js     — only handles Razorpay order creation/verification
✅ Controllers           — only parse req/res, delegate to services
✅ Models                — only define schema and basic validators
```

**Anti-pattern avoided:** A single `BookingController` that does booking + payment + notification + calendar sync inline. That's a god object — we don't do that here.

---

### O — Open/Closed Principle
> Open for extension, closed for modification.

**Notification System:**

```js
// interfaces/INotificationChannel.js
class INotificationChannel {
  async send(to, subject, body) {
    throw new Error('send() must be implemented');
  }
}

// channels/EmailChannel.js  (Resend)
class EmailChannel extends INotificationChannel {
  async send(to, subject, body) { /* Resend API call */ }
}

// channels/WhatsAppChannel.js  (Twilio)
class WhatsAppChannel extends INotificationChannel {
  async send(to, subject, body) { /* Twilio API call */ }
}

// NotificationService.js
class NotificationService {
  constructor(channels = []) {
    this.channels = channels;  // inject any channel
  }
  async notify(user, subject, body) {
    await Promise.all(this.channels.map(c => c.send(user, subject, body)));
  }
}

// Usage — add SMS tomorrow without touching NotificationService
const notifier = new NotificationService([
  new EmailChannel(),
  new WhatsAppChannel(),
  // new SMSChannel()   ← just add it here in v2
]);
```

**Benefit:** Adding SMS, push, or Slack in v2 requires ZERO changes to existing code.

---

### L — Liskov Substitution Principle
> Subtypes must be substitutable for their base types.

**Session Types:**

```js
// Base class
class BookingSession {
  validate(participants, slot) { /* base checks */ }
  calculatePrice() { throw new Error('implement'); }
}

// One-on-one always valid with 1 participant
class SoloSession extends BookingSession {
  validate(participants, slot) {
    if (participants.length !== 1) throw new Error('Solo: 1 student only');
    return super.validate(participants, slot);
  }
  calculatePrice() { return this.basePrice; }
}

// Group respects max capacity
class GroupSession extends BookingSession {
  validate(participants, slot) {
    if (participants.length > this.maxCapacity) throw new Error('Session full');
    return super.validate(participants, slot);
  }
  calculatePrice() { return this.basePrice * participants.length; }
}
```

**Benefit:** `BookingService` calls `session.validate()` without knowing the type. Replacing `SoloSession` with `GroupSession` never breaks the caller.

---

### I — Interface Segregation Principle
> Don't force modules to depend on interfaces they don't use.

**Role-specific API routes** (segregated by concern):

```
/api/tutor/*       — protected, tutor-only
/api/student/*     — protected, student-only
/api/public/*      — open, no auth (booking page)
/api/auth/*        — auth only
```

**Middleware segregated:**
```js
// roleMiddleware.js — returns specific guards
const requireTutor  = (req, res, next) => { /* check role === 'tutor'  */ }
const requireStudent = (req, res, next) => { /* check role === 'student' */ }
// Routes only import what they need — no mega-middleware object
```

**Zustand stores segregated:**
```
authStore.js       — auth state only
bookingStore.js    — booking UI state only
notificationStore.js — toast/alert state only
```

No store imports from another store's domain.

---

### D — Dependency Inversion Principle
> Depend on abstractions, not concretions.

**Service injection pattern (backend):**

```js
// BookingService depends on abstract ICalendarService
class BookingService {
  constructor(calendarService, notificationService, paymentService) {
    this.calendar = calendarService;       // abstraction
    this.notifier = notificationService;   // abstraction
    this.payment  = paymentService;        // abstraction
  }

  async createBooking(bookingData) {
    const booking = await this._persistBooking(bookingData);
    await this.payment.createOrder(booking);
    await this.calendar.addEvent(booking);
    await this.notifier.notify(booking.student, 'Booking Confirmed', booking);
    return booking;
  }
}

// In app.js — compose at the top level
const bookingService = new BookingService(
  new GoogleCalendarService(),
  new NotificationService([new EmailChannel(), new WhatsAppChannel()]),
  new RazorpayPaymentService()
);
```

**Benefit:** In tests, swap `GoogleCalendarService` with `MockCalendarService` — zero code changes in `BookingService`.

---

## 4. Database Schema (MongoDB + Mongoose)

### Users Collection
```js
{
  _id, googleId, name, email, avatar,
  role: { type: String, enum: ['tutor', 'student'] },
  tutorProfile: {               // only populated if role === 'tutor'
    slug: String,               // unique public URL slug
    bio: String,
    subjects: [String],
    cancellationHours: Number,  // minimum cancel notice
    isPublic: Boolean
  },
  createdAt, updatedAt
}
```

### Sessions Collection (Session Types defined by tutor)
```js
{
  _id, tutorId: ref(User),
  title: String, description: String,
  type: { enum: ['solo', 'group'] },
  durationMinutes: Number,
  price: Number,
  mode: { enum: ['online', 'offline', 'both'] },
  onlineLink: String,          // Zoom/Meet URL
  offlineAddress: String,
  maxCapacity: Number,         // for group sessions
  isActive: Boolean,
  createdAt, updatedAt
}
```

### Availability Collection
```js
{
  _id, tutorId: ref(User),
  weeklySchedule: [{
    dayOfWeek: { enum: [0,1,2,3,4,5,6] },
    slots: [{ startTime: String, endTime: String }]  // "09:00", "10:00"
  }],
  blockedDates: [Date],        // vacation, holidays
  createdAt, updatedAt
}
```

### Bookings Collection
```js
{
  _id, sessionId: ref(Session), tutorId: ref(User), studentId: ref(User),
  scheduledAt: Date,           // exact datetime of session
  status: { enum: ['pending','confirmed','cancelled','completed','no_show'] },
  paymentMethod: { enum: ['online','offline'] },
  paymentStatus: { enum: ['paid','unpaid','refunded'] },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  isRecurring: Boolean,
  recurringRule: String,       // cron expression e.g. "0 17 * * 1" (Mon 5pm)
  cancelledAt: Date,
  cancelledBy: ref(User),
  cancellationReason: String,
  googleCalEventId: String,    // tutor's GCal event ID
  studentGCalEventId: String,  // student's GCal event ID
  createdAt, updatedAt
}
```

### Reviews Collection
```js
{
  _id, bookingId: ref(Booking), sessionId: ref(Session),
  studentId: ref(User), tutorId: ref(User),
  rating: { type: Number, min: 1, max: 5 },
  review: String,
  isVisible: Boolean,
  createdAt
}
```

### Waitlist Collection
```js
{
  _id, sessionId: ref(Session), studentId: ref(User),
  scheduledAt: Date,           // which date/slot they want
  notified: Boolean,
  createdAt
}
```

### Payments Collection
```js
{
  _id, bookingId: ref(Booking), studentId: ref(User), tutorId: ref(User),
  amount: Number, currency: { default: 'INR' },
  razorpayOrderId: String, razorpayPaymentId: String,
  status: { enum: ['created','paid','failed','refunded'] },
  receipt: String,             // PDF receipt URL (future)
  paidAt: Date, createdAt
}
```

---

## 5. API Route Design

### Auth
```
POST   /api/auth/google          — OAuth callback, issue JWT
POST   /api/auth/refresh         — Refresh JWT
POST   /api/auth/logout          — Invalidate token
GET    /api/auth/me              — Get current user profile
```

### Public (No Auth)
```
GET    /api/public/:slug              — Get tutor public profile
GET    /api/public/:slug/sessions     — Get session types
GET    /api/public/:slug/availability — Get available slots for date range
GET    /api/public/:slug/reviews      — Get reviews
POST   /api/public/:slug/book         — Create booking (requires student auth)
```

### Student (Auth Required)
```
GET    /api/student/bookings          — All bookings
GET    /api/student/bookings/upcoming
GET    /api/student/bookings/past
POST   /api/student/bookings/:id/cancel
POST   /api/student/bookings/:id/rebook
POST   /api/student/waitlist          — Join waitlist
GET    /api/student/receipts          — Payment receipts
POST   /api/student/reviews           — Submit review
```

### Tutor (Auth + Role Guard)
```
GET    /api/tutor/dashboard/stats     — Revenue, no-shows, counts
GET    /api/tutor/bookings            — All bookings (filterable)
PATCH  /api/tutor/bookings/:id        — Mark confirmed / no-show
GET    /api/tutor/students            — Student list
GET    /api/tutor/students/:id        — Student detail + history
POST   /api/tutor/sessions            — Create session type
PUT    /api/tutor/sessions/:id        — Edit session type
DELETE /api/tutor/sessions/:id        — Deactivate
GET    /api/tutor/availability        — Get schedule
PUT    /api/tutor/availability        — Update schedule
PUT    /api/tutor/profile             — Update slug, bio, subjects
```

### Payments
```
POST   /api/payments/create-order     — Razorpay order
POST   /api/payments/verify           — Webhook verification
GET    /api/payments/:bookingId       — Receipt data
```

---

## 6. Security Checklist

| Layer | Measure |
|-------|---------|
| Auth | JWT with 1h expiry + refresh token rotation |
| CORS | Whitelist Vercel domain only |
| Rate Limiting | express-rate-limit: 100 req/15min per IP |
| Input Validation | Zod on all POST/PUT bodies |
| MongoDB | Parameterized queries via Mongoose (no raw string injection) |
| Payments | Razorpay webhook signature verification |
| OAuth | State param + PKCE to prevent CSRF on OAuth flow |
| Headers | helmet.js — sets X-Frame, CSP, HSTS |
| Env vars | Dotenv — never committed, `.env.example` tracked |
| Error responses | Never expose stack traces to client |

---

## 7. Background Jobs (node-cron)

```js
// jobs/reminderJob.js

// Run every 5 minutes — check for sessions in 24hr window
cron.schedule('*/5 * * * *', async () => {
  await ReminderService.send24HourReminders();
});

// Run every 5 minutes — check for sessions in 1hr window
cron.schedule('*/5 * * * *', async () => {
  await ReminderService.send1HourReminders();
});

// Run every minute — check waitlist for freed slots
cron.schedule('* * * * *', async () => {
  await WaitlistService.notifyNextInLine();
});
```

---

## 8. Environment Variables

### client/.env
```
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=xxx
VITE_RAZORPAY_KEY_ID=xxx
VITE_SENTRY_DSN=xxx
```

### server/.env
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=...
RAZORPAY_KEY_ID=...
RAZORPAY_SECRET=...
RESEND_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
SENTRY_DSN=...
CLIENT_URL=https://your-app.vercel.app
```

---

## 9. Deployment Pipeline

```
Developer → GitHub push
    ↓
GitHub Actions (optional CI)
    ↓ (frontend)              ↓ (backend)
Vercel auto-deploy         Render auto-deploy
    ↓                             ↓
vercel.app domain         onrender.com domain
    ↓
UptimeRobot pings /health every 5 min → prevents Render cold starts
    ↓
Sentry catches runtime errors on both ends
```

---

_Document Owner: Pramod | Last Updated: April 2026 | Version: 1.0_
