import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

/**
 * GuestRoute: Specifically for routes that should only be accessible
 * by non-authenticated users (like /login).
 * If a user is already logged in, it "jails" them back to their dashboard.
 */
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is logged in, redirect to dashboard
  if (user) {
    const dashboardMap = {
      tutor: '/tutor/dashboard',
      student: '/student/dashboard',
      admin: '/admin/dashboard'
    };
    return <Navigate to={dashboardMap[user.role] || '/student/dashboard'} replace />;
  }

  // Not logged in -> show guest-only content
  return children;
};

export default GuestRoute;
