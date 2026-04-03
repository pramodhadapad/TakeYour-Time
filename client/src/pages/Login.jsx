import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Button } from '../components/ui/button';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && user.role) {
      const from = sessionStorage.getItem('redirectAfterLogin');
      if (from) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(from, { replace: true });
        return;
      }

      const dashboardMap = {
        tutor: '/tutor/dashboard',
        student: '/student/dashboard',
        admin: '/admin/dashboard'
      };
      navigate(dashboardMap[user.role] || '/student/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleLogin = () => {
    const from = searchParams.get('from');
    if (from) {
      sessionStorage.setItem('redirectAfterLogin', from);
    }
    window.location.href = `${API}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #1e1b4b 60%, #0f172a 100%)',
      }}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }} />
        <div className="animate-float absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)', animationDelay: '2s' }} />
        <div className="animate-pulse-soft absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Login Card */}
      <div className="relative z-10 animate-slide-up">
        <div className="rounded-3xl p-10 max-w-md w-full text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Logo */}
          <div className="mb-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              Take<span style={{ color: '#60a5fa' }}>Your</span>Time
            </span>
          </div>
          <p className="text-slate-400 mb-8 text-sm">
            Sign in to book sessions or manage your schedule.
          </p>

          {/* Divider */}
          <div className="w-12 h-0.5 mx-auto mb-8 rounded-full"
            style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED)' }}
          />

          <Button
            size="lg"
            className="w-full flex items-center justify-center gap-3 text-base font-semibold rounded-xl py-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
            }}
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </Button>

          <p className="text-xs text-slate-500 mt-8 leading-relaxed">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-slate-400 hover:text-white transition-colors underline underline-offset-2">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-slate-400 hover:text-white transition-colors underline underline-offset-2">Privacy Policy</a>.
          </p>
        </div>

        {/* Subtle glow under card */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full blur-2xl opacity-20"
          style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED)' }}
        />
      </div>
    </div>
  );
}
