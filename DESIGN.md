# DESIGN.md — Take Your Time
### UI/UX Design System & Product Design Spec · v1.0 · April 2026

---

## 1. Design Philosophy

**Aesthetic:** Professional · Corporate · Trustworthy  
**Feeling:** _"A premium tool a tutor is proud to share with their students."_

The design should communicate **reliability and calm** — students should feel confident booking, tutors should feel in control. Zero clutter. No distractions. Every screen has one primary action.

---

## 2. Brand Identity

### 2.1 Color Palette

```
Primary:       #2563EB    (Blue-600)       — CTAs, active states, links
Primary Dark:  #1D4ED8    (Blue-700)       — Hover states
Accent:        #7C3AED    (Violet-600)     — Badges, highlights, ratings
Success:       #16A34A    (Green-600)      — Confirmed bookings, paid
Warning:       #D97706    (Amber-600)      — Pending, offline payment
Danger:        #DC2626    (Red-600)        — Cancellations, errors
Neutral-900:   #0F172A    (Slate-900)      — Body text
Neutral-600:   #475569    (Slate-600)      — Secondary text
Neutral-100:   #F1F5F9    (Slate-100)      — Backgrounds, cards
White:         #FFFFFF                      — Base surface
Border:        #E2E8F0    (Slate-200)      — Dividers, input borders
```

### 2.2 Typography

```
Font Family:   Inter (Google Fonts)
Display:       Inter 700 — 36px / 40px line-height  (Hero headings)
H1:            Inter 700 — 28px / 34px
H2:            Inter 600 — 22px / 28px
H3:            Inter 600 — 18px / 24px
Body:          Inter 400 — 15px / 22px
Small:         Inter 400 — 13px / 18px
Caption:       Inter 400 — 12px / 16px   (Labels, metadata)
Code:          JetBrains Mono — 13px
```

### 2.3 Spacing System (4px base grid)
```
xs:   4px    sm:  8px    md: 16px
lg:  24px    xl: 32px   2xl: 48px    3xl: 64px
```

### 2.4 Border Radius
```
sm:  6px    md: 10px    lg: 16px    xl: 24px    full: 9999px
```

### 2.5 Shadows
```
card:     0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06)
elevated: 0 4px 12px rgba(0,0,0,.10), 0 2px 6px rgba(0,0,0,.06)
modal:    0 20px 60px rgba(0,0,0,.18)
```

---

## 3. Component Library

All components built with **Tailwind CSS** + **shadcn/ui** base. Custom overrides per design token above.

### 3.1 Button Variants
| Variant | Use Case |
|---------|----------|
| `primary` | Book Session, Confirm, Save |
| `secondary` | Cancel, Go Back |
| `ghost` | Inline actions (Edit, View) |
| `destructive` | Delete, Cancel Booking |
| `outline` | Secondary CTAs on public page |

### 3.2 Status Badges
| Status | Color |
|--------|-------|
| Confirmed | Green bg + text |
| Pending | Amber bg + text |
| Cancelled | Red bg + text |
| Waitlisted | Violet bg + text |
| Completed | Slate bg + text |
| Online session | Blue bg + text |
| Offline session | Orange bg + text |

### 3.3 Card Components
- `BookingCard` — student's upcoming/past session tile
- `SessionTypeCard` — tutor's session definition card
- `StudentCard` — student overview in tutor list
- `ReviewCard` — star + text review display
- `StatCard` — metric with icon (used in analytics)

---

## 4. Page-by-Page Design Spec

### 4.1 Landing Page `/`
**Purpose:** Convert visiting students into booked sessions.

**Layout Sections:**
1. **Hero** — Headline + subheadline + "View Available Sessions" CTA + tutor photo
2. **How It Works** — 3-step visual flow (Browse → Book → Attend)
3. **Session Types** — Cards for each session type the tutor offers
4. **Reviews** — Star ratings grid (masonry layout)
5. **Footer** — Contact, social, booking CTA repeated

**Key rules:**
- Above-fold CTA must be visible without scroll on all screen sizes
- No login required to VIEW the page
- Login required only when "Book" is clicked

---

### 4.2 Auth Flow `/login`
- Single screen: Google Sign-In button, centered card layout
- Auto role-detection: if email matches tutor email → redirect to `/tutor/dashboard`, else → `/student/dashboard`
- First-time students: profile setup modal after OAuth (name confirmation only — Google fills the rest)

---

### 4.3 Public Booking Page `/book/:tutorSlug`
**Purpose:** The shareable link the tutor sends students.

**Layout:**
```
┌──────────────────────────────────────┐
│  Tutor Avatar + Name + Bio           │
│  Subject Tags (chips)                │
│  ⭐ 4.8 (23 reviews)                  │
├──────────────────────────────────────┤
│  SESSION TYPE PICKER                 │
│  [One-on-One Math] [Group Physics]   │
├──────────────────────────────────────┤
│  DATE PICKER (horizontal week strip) │
│  TIME SLOT GRID (available = blue)   │
├──────────────────────────────────────┤
│  BOOKING SUMMARY SIDEBAR             │
│  Session · Date · Time · Price       │
│  [Pay Online] [Pay at Session]       │
│  [Confirm Booking] CTA               │
└──────────────────────────────────────┘
```

**Mobile:** Stack all sections vertically. Sticky bottom "Confirm Booking" button.

---

### 4.4 Student Dashboard `/student/dashboard`

**Sidebar Nav:**
- Overview
- Upcoming Sessions
- Past Sessions
- Receipts
- Settings

**Overview tab layout:**
```
┌─────────────────┬──────────────────┐
│ Next Session    │ Total Sessions   │
│ [Join/View]     │ [This month]     │
├─────────────────┴──────────────────┤
│ UPCOMING SESSIONS (BookingCards)   │
│ [Cancel] [Add to Calendar]         │
├────────────────────────────────────┤
│ PAST SESSIONS + [Rebook] button    │
│ [Leave Review] if not yet reviewed │
└────────────────────────────────────┘
```

---

### 4.5 Tutor Dashboard `/tutor/dashboard`

**Sidebar Nav:**
- Overview
- Calendar
- Sessions & Types
- Students
- Analytics
- Settings

**Overview tab:**
```
┌──────────┬──────────┬──────────┬──────────┐
│ Today's  │ This     │ Revenue  │ No-show  │
│ Sessions │ Month    │ (Month)  │ Rate     │
└──────────┴──────────┴──────────┴──────────┘
┌──────────────────┬─────────────────────────┐
│ CALENDAR VIEW    │ UPCOMING BOOKINGS LIST  │
│ (week/month)     │ Student · Time · Status │
│                  │ [Confirm] [Mark No-show]│
└──────────────────┴─────────────────────────┘
```

**Calendar Component:**
- Week view default, toggle month view
- Color-coded: confirmed (blue), pending (amber), cancelled (red/strikethrough)
- Click on slot → BookingDetail modal

**Analytics tab:**
- Revenue chart (bar, last 30 days)
- Booking volume trend (line)
- No-show + cancellation donut chart
- Top students by sessions table

---

### 4.6 Modals
| Modal | Trigger |
|-------|---------|
| `BookingConfirmModal` | Student confirms booking |
| `CancelBookingModal` | Cancel with reason + policy reminder |
| `BookingDetailModal` | Tutor clicks calendar slot |
| `ReviewModal` | Post-session review submission |
| `RescheduleModal` | Student reschedules (within policy) |
| `WaitlistJoinModal` | Full group session |

---

## 5. Responsive Breakpoints

```
Mobile:   375px – 767px    (single column, stacked layout)
Tablet:   768px – 1023px   (2-col, condensed sidebar)
Desktop:  1024px – 1440px  (full sidebar + main + optional right panel)
Wide:     1441px+           (max-width: 1280px container, centered)
```

---

## 6. Accessibility (WCAG 2.1 AA)

- All interactive elements have `:focus-visible` ring styles
- Color contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- All form inputs have visible labels (not just placeholders)
- Modals trap focus and close on `Escape`
- Booking confirmation includes screen-reader announcements
- Images have `alt` attributes; icons have `aria-label`

---

## 7. Loading & Empty States

### Loading
- Skeleton screens (not spinners) for dashboards and booking page
- Button loading: spinner inside button, disabled state

### Empty States
- No upcoming sessions → Illustration + "Browse available sessions" CTA
- No students → "Share your booking link to get started"
- No reviews → "Your first review will appear here"

### Error States
- Network error → Toast notification (bottom-right)
- Booking failed → Inline error in booking summary
- Payment failed → Dedicated error screen with retry CTA

---

## 8. Notification Toast System

Position: **Bottom-right**, max 3 stacked  
Auto-dismiss: 4 seconds  
Variants: `success`, `error`, `warning`, `info`

---

## 9. Design Tokens File Reference

```js
// tailwind.config.js extension
colors: {
  brand: {
    primary: '#2563EB',
    dark: '#1D4ED8',
    accent: '#7C3AED',
  },
  status: {
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
  }
}
```

---

_Document Owner: Pramod | Last Updated: April 2026 | Version: 1.0_
