<div align="center">

<img src="https://raw.githubusercontent.com/pramodhadapad/TakeYour-Time/main/client/src/assets/hero.png" alt="Take Your Time" width="180" />

# Take Your Time

**Premium Tutor-Student Marketplace & Booking Platform**

[![MERN Stack](https://img.shields.io/badge/MERN_Stack-blue?style=for-the-badge&logo=mongodb)](https://github.com/pramodhadapad/TakeYour-Time)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Live Demo](https://takeyourtime.vercel.app) · [Report a Bug](https://github.com/pramodhadapad/TakeYour-Time/issues) · [Request Feature](https://github.com/pramodhadapad/TakeYour-Time/issues)

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Design System](#-the-digital-curator-design-system)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Overview

**Take Your Time** is a full-stack educational marketplace that connects expert domain specialists with dedicated students through a seamless, secure, and beautifully designed booking experience.

The platform handles end-to-end session management — from tutor discovery and intelligent conflict-free scheduling to Razorpay-powered payments, automated email/SMS notifications, and real-time dashboards for both tutors and students.

> Built for educators who value their expertise and students who value their time.

---

## 🏛️ The "Digital Curator" Design System

The UI follows a strict editorial design philosophy documented in [`DESIGN.md`](./DESIGN.md):

| Dimension | Decision |
|---|---|
| **Headline Font** | [Epilogue](https://fonts.google.com/specimen/Epilogue) — bold, executive presence |
| **Body Font** | [Inter](https://fonts.google.com/specimen/Inter) — maximum readability |
| **Primary Color** | `#5382ff` — Primary Blue |
| **Background** | `#000928` — Deep Navy |
| **Surface Layers** | Tonal glass surfaces with layered depth |
| **Layout Pattern** | Asymmetric bento-grids for dashboards; editorial columns for landing |
| **Motion** | Pulse, Float, and Fade-in-up micro-animations |
| **Components** | High-impact glassmorphism cards (`.glass-card`) |

---

## ✨ Features

### For Students
- 🔍 **Tutor Discovery** — Browse and filter expert tutors by subject, rating, and availability
- 📅 **Smart Booking** — Intelligent conflict detection prevents double-bookings
- 💳 **One-Click Payments** — Secure Razorpay checkout with instant payment verification
- 📊 **Unified Dashboard** — Manage your entire booking timeline in one view
- ⭐ **Reviews & Ratings** — Share and read authentic session feedback
- 🔄 **Auth-Aware Redirects** — Return directly to your booking flow after login

### For Tutors
- 📈 **Revenue Analytics** — Real-time earnings overview with KPI bento-grids
- 🗓️ **Schedule Management** — Interactive calendar with drag-and-drop availability control
- 📬 **Automated Notifications** — Instant booking alerts via email and SMS
- 🧾 **Session History** — Detailed logs of all past and upcoming sessions

### Platform-Wide
- 🔐 **Google OAuth 2.0** — One-click sign-in with JWT access/refresh token rotation
- 📧 **Transactional Emails** — Booking confirmations and reminders via Resend
- 💬 **SMS & WhatsApp Alerts** — Real-time notifications via Twilio
- 🛡️ **Security Hardened** — Helmet.js headers, Express rate-limiting, and Sentry monitoring

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 (Vite) | Core UI framework |
| Tailwind CSS 4.0 | CSS-first utility styling |
| Zustand | Lightweight atomic state management |
| Lucide React + Google Material Symbols | Icon libraries |
| Radix UI Primitives | Accessible headless components |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB Atlas + Mongoose | Primary database and ODM |
| Passport.js | Google OAuth 2.0 strategy |
| JWT (Access + Refresh) | Stateless authentication with token rotation |
| Socket.io | Real-time event layer (configurable) |
| Helmet.js + express-rate-limit | Security hardening |

### Third-Party Integrations

| Service | Purpose |
|---|---|
| **Google Cloud** | OAuth 2.0 authentication & identity |
| **Razorpay** | Payment gateway for session bookings |
| **Resend** | Transactional email delivery |
| **Twilio** | SMS & WhatsApp booking notifications |
| **Sentry** | Full-stack error tracking & performance monitoring |
| **Vercel** | Production edge deployment & CI/CD |

---

## 🏗️ Architecture

```
TakeYour-Time/
├── client/                   # React 19 + Vite frontend
│   ├── src/
│   │   ├── assets/           # Static media
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level page components
│   │   ├── store/            # Zustand state slices
│   │   └── lib/              # Utilities and API helpers
│   └── tailwind.config.js
│
├── server/                   # Node.js + Express backend
│   ├── config/               # DB, Passport, and env setup
│   ├── controllers/          # Route handler logic
│   ├── middleware/            # Auth, error, rate-limit
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   └── services/             # Razorpay, Resend, Twilio integrations
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed and configured before proceeding:

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **MongoDB Atlas** cluster (M0 free tier is sufficient for development)
- API credentials for: Google Cloud, Razorpay, Resend, and Twilio

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/pramodhadapad/TakeYour-Time.git
cd TakeYour-Time

# 2. Install backend dependencies
cd server && npm install

# 3. Install frontend dependencies
cd ../client && npm install
```

### Environment Variables

Create `.env` files in both `server/` and `client/` directories.

**`server/.env`**

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/takeyourtime

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Payments
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Notifications
RESEND_API_KEY=re_your_resend_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

**`client/.env`**

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

> ⚠️ Never commit `.env` files to version control. Both directories include `.env` in `.gitignore`.

### Running Locally

Open two terminal windows:

```bash
# Terminal 1 — Backend
cd server
npm run dev
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd client
npm run dev
# Runs on http://localhost:5173
```

---

## ☁️ Deployment

The recommended production topology:

| Layer | Platform | Notes |
|---|---|---|
| **Frontend** | [Vercel](https://vercel.com) | Edge functions, auto CI/CD from `main` |
| **Backend** | [Render](https://render.com) | Node web service, free tier available |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | M0 free tier or M10+ for production |

### Vercel (Frontend)

1. Connect your GitHub repository to Vercel
2. Set the **root directory** to `client`
3. Add all `VITE_*` environment variables in the Vercel dashboard
4. Deploy — Vercel handles builds automatically on every push to `main`

### Render (Backend)

1. Create a new **Web Service** on Render pointing to the `server/` directory
2. Set the build command to `npm install` and start command to `npm start`
3. Add all server environment variables in the Render dashboard

---

## 🤝 Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to your branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">

Built with ❤️ by [Pramod Hadapad](https://github.com/pramodhadapad)

*Empowering the future of decentralized education.*

</div>
