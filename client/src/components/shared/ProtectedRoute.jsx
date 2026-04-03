import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" />;

  // User hasn't picked a role yet and is trying to access a role-specific page → onboarding
  if (role && (!user.role || !user.onboarded)) return <Navigate to="/onboarding" />;

  // User has a role but it doesn't match → redirect to their correct dashboard
  if (role && user.role !== role) {
    const dashboardMap = {
      tutor: '/tutor/dashboard',
      student: '/student/dashboard',
      admin: '/admin/dashboard'
    };
    return <Navigate to={dashboardMap[user.role] || '/login'} />;
  }

  return children;
};

export default ProtectedRoute;
