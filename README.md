<div align="center">
  <img src="https://raw.githubusercontent.com/pramodhadapad/TakeYour-Time/main/client/src/assets/hero.png" alt="Take Your Time Logo" width="200" height="auto" />
  <h1>Take Your Time</h1>
  <p><em>Premium Digital Curator: A High-End Tutor-Student Marketplace</em></p>

  <!-- Production Links -->
  <p>
    <a href="https://take-yourtime.vercel.app" target="_blank">
      <img src="https://img.shields.io/badge/Live_Front--end-Vercel-black?style=for-the-badge&logo=vercel" alt="Live Frontend" />
    </a>
    <a href="https://takeyour-time-1.onrender.com/health" target="_blank">
      <img src="https://img.shields.io/badge/Live_Back--end-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Live Backend" />
    </a>
  </p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/MERN_Stack-blue?style=for-the-badge&logo=mongodb" alt="MERN Stack" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

---

## 📖 Overview
**Take Your Time** is a sophisticated, full-stack marketplace designed for premium educational mentorship. The platform has been completely overhauled with the **"Digital Curator"** design system—an editorial-inspired aesthetic characterized by high-end glassmorphism, tonal surface layering, and asymmetric bento-grid layouts.

It bridges the gap between expert domain specialists and dedicated students through a seamless, secure, and visually stunning booking experience.

---

## 🏛️ The "Digital Curator" Design System
The platform follows a strict architectural design philosophy:
- **Typography:** Headlines in **Epilogue** for a bold, executive feel; Body text in **Inter** for maximum readability.
- **Aesthetics:** High-impact glass backgrounds (`.glass-card`), tonal surface hierarchy, and premium animation keyframes (Pulse, Float, Fade-in-up).
- **Layouts:** Executive bento-grids for dashboards and asymmetric columns for the landing experience.
- **Color Palette:** Deep Navy (`#000928`), Primary Blue (`#5382ff`), and Surface Tones.

---

## 🛠️ Comprehensive Technology Stack

### Core Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS 4.0 (CSS-first configuration with custom tokens)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Atomic & High-performance)
- **Routing:** React Router DOM v7
- **UI Components:** Premium custom glassmorphism components with Radix UI primitives.
- **Icons:** Lucide React & Google Material Symbols.

### Core Backend
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB Atlas with Mongoose ODM (Optimization for slot availability queries).
- **Authentication:** Passport.js (Google OAuth 2.0 implementation with redirect state management).
- **Security:** JWT (Access/Refresh token rotation), Helmet.js, Express-Rate-Limit, CORS (Secure credentials handling).

---

## 🔗 Integrated Services & API Plugins

| Service | Category | Purpose |
| :--- | :--- | :--- |
| **Google Cloud** | Identity | OAuth 2.0 Social Login & Identity Verification |
| **Razorpay** | Payments | Seamless checkout for paid session investments |
| **Resend** | Email | Premium Transactional Email (Booking confirmations/reminders) |
| **Twilio** | SMS/WhatsApp | Automated instant notifications for real-time alerts |
| **Sentry** | Observability | Full-stack performance tracking and error reporting |
| **Vercel** | CI/CD | Frontend hosting with edge performance |
| **Render** | CI/CD | Backend Node.js service hosting |

---

## ✨ Key Features & Business Logic
- **🛡️ Secure Booking Flow:** Intelligent conflict detection and multi-step session confirmation.
- **📧 Smart Notifications:** Booking emails are automatically triggered only after successful payment verification.
- **📊 Executive Dashboards:** 
  - **Tutors:** Revenue analytics, bento-grid stats, and interactive availability management.
  - **Students:** Unified booking timeline, glass-card tutor discovery, and profile management.
- **🔄 Session Resilience:** Auth-redirect logic that preserves your booking path after login.
- **🌙 Midnight Support:** Full support for availability slots spanning past midnight (e.g., 11:30 PM - 1:30 AM).

---

## ⚙️ Local Development Setup

### 1. Installation
```bash
git clone https://github.com/pramodhadapad/TakeYour-Time.git
cd TakeYour-Time
cd server && npm install
cd ../client && npm install
```

### 2. Environment Variables
Ensure both `.env` files are configured based on the templates in `server/` and `client/`.

---

<p align="center">
  Built with ❤️ for the future of decentralized education.
</p>
