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

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  return (
    <>
      <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={
          <GuestRoute><Login /></GuestRoute>
        } />
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
