<div align="center">
  <img src="https://raw.githubusercontent.com/pramodhadapad/TakeYour-Time/main/client/src/assets/hero.png" alt="Take Your Time Logo" width="200" height="auto" />
  <h1>Take Your Time</h1>
  <p><em>Premium Tutor-Student Marketplace & Booking Platform</em></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/MERN_Stack-blue?style=for-the-badge&logo=mongodb" alt="MERN Stack" />
    <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

---

## 📖 Overview
**Take Your Time** is a full-stack, premium tutoring and educational marketplace. It connects students seamlessly with expert tutors through an intuitive booking and scheduling system. The platform features dedicated dashboards for Students, Tutors, and System Administrators with rich, dynamic UI powered by React, Tailwind CSS, and Framer Motion. 

Live Link: [Take Your Time (Vercel)](https://take-your-time-seven.vercel.app/)

---

## ✨ Key Features
### 🛡️ Secure & Role-Based Environment
- **Google OAuth & JWT Authentication:** Secure login using Google credentials combined with robust JWT access/refresh token rotation.
- **Strict Role-Based Access Control (RBAC):** Distinct roles (`Student`, `Tutor`, `Admin`) with Route "Jailing" to prevent layout hopping and unauthorized access.

### 📚 Dedicated Dashboards
- **Student Portal:** Browse available tutors, manage upcoming/past class schedules, write and submit reviews, and control profile settings.
- **Tutor Portal:** Full CRUD management of active classes, availability slot scheduling, earnings tracking, and session cancellation workflows.
- **Admin Control Center:** Global overview of total platform bookings, revenue, account suspensions, and deep access controls.

### 💳 Core Architecture
- **State Management:** Handled blazingly fast using [Zustand](https://zustand-demo.pmnd.rs/).
- **Micro-Animations & UI Exellence:** Uses modern Glassmorphism, smooth skeleton loaders, and interactive hover states tailored with Tailwind CSS and Framer Motion.

---

## 🛠️ Technology Stack

### Frontend (User Interface)
* **Framework:** React 18 (Vite)
* **Styling:** Tailwind CSS + custom Glassmorphism UI
* **Components:** Shadcn/UI primitives
* **State Management:** Zustand
* **Routing:** React Router v6
* **Icons:** Lucide-React

### Backend (API & Business Logic)
* **Platform:** Node.js environment via Express.js
* **Security:** Helmet, CORS, Express Rate-Limit, Passport.js
* **Payments/Emails:** Razorpay (payment gateway), Resend (Transactional emails)

### Database (Data Layer)
* **Primary Database:** MongoDB Atlas (NoSQL)
* **ODM / Driver:** Mongoose
* **Schema Design:** Heavily normalized schemas connecting `Users`, `Sessions`, `Bookings`, and `Reviews` with populates.

---

## ⚙️ Getting Started (Local Development)

### Prerequisites
Make sure you have Node.js and MongoDB installed on your local machine.
You will also need a MongoDB Atlas Cluster and a Google Cloud Console application to populate the environment variables.

### 1. Clone the repository
```bash
git clone https://github.com/pramodhadapad/TakeYour-Time.git
cd TakeYour-Time
```

### 2. Install Dependencies
Run npm install in **both** the client and server directories:

```bash
# Terminal 1 - Backend
cd server
npm install

# Terminal 2 - Frontend
cd client
npm install
```

### 3. Setup Environment Variables
Create a `.env` file inside both `client/` and `server/` using the format below.

#### Server Environment (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<your_username>:<password>@cluster0...
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:5173
```

#### Client Environment (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Run the Application
Start both the Frontend and Backend servers simultaneously:

```bash
# Terminal 1 - Start the backend server
cd server
npm run dev

# Terminal 2 - Start the frontend Vite server
cd client
npm run dev
```

Visit the app at `http://localhost:5173`.

---

## 🚀 Deployment Guide
The project is built specifically to deploy rapidly to Serverless and PaaS architecture.

### **1. Backend (Render)**
- Set the Root Directory strictly to `server/`.
- Use the Build Command: `npm install`
- Use the Start Command: `node server.js`
- Paste all `server/.env` variables into the secret files.

### **2. Frontend (Vercel)**
- Set the Root Directory strictly to `client/`.
- Use the standard `Vite` preset.
- Make sure to point `VITE_API_BASE_URL` to the live Render backend link.
- Update the Google Cloud credentials callback URIs to the new `.vercel.app` and `.onrender.com` strings to unblock secure OAuth!

---

<p align="center">
  <br>
  Built for excellence, speed, and education. ✨
</p>
