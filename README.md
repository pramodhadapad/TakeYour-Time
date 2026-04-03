<div align="center">
  <img src="https://raw.githubusercontent.com/pramodhadapad/TakeYour-Time/main/client/src/assets/hero.png" alt="Take Your Time Logo" width="200" height="auto" />
  <h1>Take Your Time</h1>
  <p><em>Premium Digital Curator: A High-End Tutor-Student Marketplace</em></p>

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
The platform follows a strict architectural design philosophy defined in `DESIGN.md`:
- **Typography:** Headlines in **Epilogue** for a bold, executive feel; Body text in **Inter** for maximum readability.
- **Aesthetics:** High-impact glass backgrounds (`.glass-card`), subtle micro-animations (Pulse, Float, Fade-in-up), and a curated palette of Deep Navy (`#000928`), Primary Blue (`#5382ff`), and Surface Tones.
- **Layouts:** Executive bento-grids for dashboards and asymmetric columns for the landing experience.

---

## 🛠️ Technology Stack & Integrations

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS 4.0 (CSS-first configuration)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Atomic & Fast)
- **Icons:** Lucide React & Google Material Symbols
- **Components:** Custom premium glassmorphism components & Radix UI primitives

### Backend
- **Platform:** Node.js & Express.js
- **Database:** MongoDB Atlas with Mongoose ODM
- **Real-time:** Socket.io (Configurable for live updates)
- **Security:** Passport.js (Google OAuth 2.0), JWT (Access/Refresh rotation), Helmet.js, Express-Rate-Limit

### Core Integrations
| Service | Purpose |
| :--- | :--- |
| **Google Cloud** | OAuth 2.0 Authentication & Identity Management |
| **Razorpay** | Secure Payment Gateway for session investments |
| **Resend** | Premium Transactional Email delivery (Confirmations/Reminders) |
| **Sentry** | Full-stack Error Tracking & Performance Monitoring |
| **Twilio** | SMS & WhatsApp notifications for instant booking alerts |
| **Vercel** | Production Edge Deployment & CI/CD |

---

## ✨ Key Features
- **🛡️ Secure Booking Flow:** Intelligent conflict detection and multi-step session confirmation.
- **📊 Executive Dashboards:** 
  - **Tutors:** Revenue analytics, KPI bento-grids, and interactive schedule management.
  - **Students:** Unified booking timeline, tutor discovery, and review systems.
- **💳 Payment Integration:** One-click Razorpay checkout with instant payment verification.
- **📧 Automated Notifications:** Seamless email and SMS alerts via Resend and Twilio.
- **🔄 Session Redirects:** Smart auth-redirects that return you to your booking flow after login.

---

## ⚙️ Local Development Setup

### 1. Requirements
- Node.js (v18+)
- MongoDB (Local or Atlas)
- API Keys for Google, Razorpay, Resend, and Twilio

### 2. Installation
```bash
# Clone the vision
git clone https://github.com/pramodhadapad/TakeYour-Time.git
cd TakeYour-Time

# Install Backend
cd server && npm install

# Install Frontend
cd ../client && npm install
```

### 3. Environment Config
Create `.env` files in both directories following the provided templates.

**Server (`server/.env`):**
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
RAZORPAY_KEY_ID=...
RESEND_API_KEY=...
TWILIO_ACCOUNT_SID=...
```

### 4. Launch
```bash
# Start concurrently or in separate terminals
# Backend (Server)
npm run dev

# Frontend (Client)
npm run dev
```

---

## 🚀 Deployment
Optimal deployment strategy:
- **Frontend:** Vercel (Edge Functions)
- **Backend:** Render or AWS (Node service)
- **Database:** MongoDB Atlas

---

<p align="center">
  Built with ❤️ for the future of decentralized education.
</p>
