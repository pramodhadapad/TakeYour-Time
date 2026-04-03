import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { setToken, fetchUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const isNew = searchParams.get('new') === 'true';

    if (token) {
      setToken(token);
      fetchUser().then(() => {
        const user = useAuthStore.getState().user;
        if (!user) {
          navigate('/');
          return;
        }

        // New user or not yet onboarded → go to role selection
        if (isNew || !user.onboarded || !user.role) {
          navigate('/onboarding');
        } else {
          const dashboardMap = {
            tutor: '/tutor/dashboard',
            student: '/student/dashboard',
            admin: '/admin/dashboard'
          };
          navigate(dashboardMap[user.role] || '/student/dashboard');
        }
      });
    } else {
      navigate('/login');
    }
  }, [searchParams, setToken, fetchUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
