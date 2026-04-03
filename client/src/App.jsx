import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Onboarding from './pages/Onboarding';
import BrowseTutors from './pages/student/BrowseTutors';
import BookingPage from './pages/BookingPage';
import StudentDashboard from './pages/student/Dashboard';
import TutorDashboard from './pages/tutor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProtectedRoute from './components/shared/ProtectedRoute';
import ToastContainer from './components/shared/ToastContainer';

function App() {
  const { fetchUser, token } = useAuthStore();
  const [introGone, setIntroGone] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  /* Global Splash Screen Timer */
  useEffect(() => {
    const timer = setTimeout(() => setIntroGone(true), 2800);
    // Add a scroll listener to dismiss early if they start scrolling immediately
    const onScroll = () => setIntroGone(true);
    window.addEventListener('scroll', onScroll, { once: true });
    return () => { 
      clearTimeout(timer); 
      window.removeEventListener('scroll', onScroll); 
    };
  }, []);

  return (
    <>
      {/* ─── GLOBAL INTRO SPLASH ─── */}
      <div
        className="intro-splash"
        style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: '#1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: introGone ? 0 : 1,
          pointerEvents: introGone ? 'none' : 'all',
          transition: 'opacity 1s ease',
        }}
      >
        <img
          src="/images/intropage.webp"
          alt="Take Your Time"
          style={{ maxWidth: '70%', maxHeight: '70vh', objectFit: 'contain' }}
        />
      </div>

      <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/browse" element={<BrowseTutors />} />
        <Route path="/book/:tutorSlug" element={<BookingPage />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Onboarding — requires auth but no role yet */}
        <Route path="/onboarding" element={
          <ProtectedRoute><Onboarding /></ProtectedRoute>
        } />

        {/* Student Protected */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
        } />

        {/* Tutor Protected */}
        <Route path="/tutor/dashboard" element={
          <ProtectedRoute role="tutor"><TutorDashboard /></ProtectedRoute>
        } />

        {/* Admin Protected */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />
      </Routes>
      <ToastContainer />
    </Router>
    </>
  );
}

export default App;
