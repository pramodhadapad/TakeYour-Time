# PRD.md — Take Your Time
### Product Requirements Document · v1.0 · April 2026

---

## 1. Product Overview

**Product Name:** Take Your Time  
**Type:** Two-sided SaaS Appointment Booking Platform for Tutors & Students  
**Tagline:** _Book smarter. Learn better._  
**Owner:** Pramod (Solo Developer)  
**Status:** Pre-development · v1 Roadmap

---

## 2. Problem Statement

Independent tutors and coaches waste hours managing bookings manually via WhatsApp, calls, and spreadsheets. Students have no transparent self-serve way to view availability, book sessions, pay, or get reminders — leading to no-shows, double bookings, and lost revenue.

**Take Your Time** eliminates this friction with a clean, production-grade booking layer between tutor and student.

---

## 3. Target Users

### 3.1 Primary User: Tutor (Provider / Admin)
- Independent tutor or coach managing their own students
- Needs full calendar control, earnings visibility, and zero-admin overhead
- Tech comfort: moderate — expects clean UX, not developer tooling

### 3.2 Secondary User: Student (Booker)
- Student or learner booking sessions with their tutor
- Needs frictionless booking, reminders, and a payment trail
- Primary touchpoint: public booking page + personal dashboard

---

## 4. User Stories

### Tutor Stories
| ID | Story |
|----|-------|
| T-01 | As a tutor, I want to sign in with Google so I don't need a separate password. |
| T-02 | As a tutor, I want to define my available time slots with custom session durations. |
| T-03 | As a tutor, I want to create one-on-one and group session types. |
| T-04 | As a tutor, I want to set a cancellation policy (X hours minimum notice). |
| T-05 | As a tutor, I want a calendar view of all my upcoming bookings. |
| T-06 | As a tutor, I want to see total revenue, no-shows, and cancellation analytics. |
| T-07 | As a tutor, I want my bookings synced to Google Calendar automatically. |
| T-08 | As a tutor, I want to set sessions as online (with a link) or offline (with address). |
| T-09 | As a tutor, I want a public booking page where students can book directly. |
| T-10 | As a tutor, I want to customize my public page with a photo, bio, and subject tags. |
| T-11 | As a tutor, I want to receive an email and WhatsApp alert for every new booking. |
| T-12 | As a tutor, I want to see a list of all students and their session history. |

### Student Stories
| ID | Story |
|----|-------|
| S-01 | As a student, I want to sign in with Google so booking is instant. |
| S-02 | As a student, I want to view all available slots and book one easily. |
| S-03 | As a student, I want to pay online (Razorpay) or choose pay-at-session. |
| S-04 | As a student, I want email + WhatsApp reminders 24hr and 1hr before my session. |
| S-05 | As a student, I want my session added to my Google Calendar after booking. |
| S-06 | As a student, I want to cancel a session (within allowed hours). |
| S-07 | As a student, I want to optionally set up recurring weekly/monthly bookings. |
| S-08 | As a student, I want to join a waitlist if a group session is full. |
| S-09 | As a student, I want to view my past sessions and payment receipts. |
| S-10 | As a student, I want to rebook a past session in one click. |
| S-11 | As a student, I want to leave a star rating and written review after a session. |

---

## 5. Feature Scope

### 5.1 MVP (v1.0)
- [ ] Google OAuth (Tutor + Student)
- [ ] Tutor: Create & manage session types (duration, price, format, online/offline)
- [ ] Tutor: Set availability windows per weekday
- [ ] Student: Public booking page (book without dashboard)
- [ ] Student: Dashboard with upcoming/past bookings
- [ ] Booking engine: one-on-one + group sessions
- [ ] Cancellation with X-hour policy enforcement
- [ ] Payments: Razorpay (online) + offline mode
- [ ] Email notifications (Resend)
- [ ] WhatsApp notifications (Twilio Sandbox)
- [ ] Reminders: 24hr + 1hr via node-cron
- [ ] Tutor Dashboard: Calendar view + student list
- [ ] Tutor Dashboard: Revenue + no-show stats

### 5.2 v1.1 Additions
- [ ] Google Calendar sync (Tutor + Student)
- [ ] Waitlist with auto-notification
- [ ] Recurring bookings (optional, student-controlled)
- [ ] Star rating + written review system
- [ ] Sentry error monitoring

### 5.3 v2.0 (Future)
- [ ] Multi-tutor marketplace
- [ ] Video call embed (Jitsi or Google Meet link injection)
- [ ] Student progress tracking
- [ ] Promo codes / discount logic
- [ ] SaaS subscription tiers (Tutor pricing plans)

---

## 6. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Page load < 2s on 4G mobile |
| Availability | 99.5% uptime target (Render + Vercel) |
| Security | JWT-based auth, HTTPS-only, CORS restricted, rate limiting on APIs |
| Scalability | Stateless backend, MongoDB Atlas horizontal scale |
| Accessibility | WCAG 2.1 AA compliant |
| Responsiveness | Fully functional on mobile (375px) and desktop (1440px) |
| Error Tracking | Sentry integration on both frontend and backend |
| Observability | UptimeRobot heartbeat on backend (avoid cold starts) |

---

## 7. Constraints

- Solo developer, no deadline pressure — quality over speed
- Free-tier infrastructure (Render, Vercel, MongoDB Atlas M0, Resend, Twilio Sandbox)
- No Docker, no Kubernetes — simple deployment pipeline
- No multi-tenancy in v1 — single tutor scope

---

## 8. Success Metrics

| Metric | Target (3 months post-launch) |
|--------|-------------------------------|
| Bookings completed | 50+ sessions booked |
| No-show reduction | < 15% no-show rate (vs industry avg 30%) |
| Student retention | > 60% students rebook within 30 days |
| Reminder delivery rate | > 95% email delivery, > 90% WhatsApp delivery |
| Page load (LCP) | < 2.5s on mobile |

---

## 9. Assumptions & Open Questions

- [ ] What is the cancellation window in hours? (e.g., 24hr, 6hr, 2hr) — **TBD by tutor**
- [ ] Should offline payment be "mark as paid" by tutor, or self-reported by student?
- [ ] Maximum students per group session — configurable or capped?
- [ ] Will the tutor handle multiple subjects or one niche?

---

_Document Owner: Pramod | Last Updated: April 2026 | Version: 1.0_
