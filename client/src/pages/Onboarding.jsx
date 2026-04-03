import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import { GraduationCap, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const roles = [
  {
    id: 'student',
    title: 'I want to Learn',
    subtitle: 'Book sessions with expert tutors',
    icon: GraduationCap,
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    borderActive: 'border-blue-500 ring-4 ring-blue-100',
    features: [
      'Browse expert tutors across subjects',
      'Book 1-on-1 or group sessions',
      'Get calendar reminders & notifications',
      'Leave reviews & track your progress'
    ]
  },
  {
    id: 'tutor',
    title: 'I want to Teach',
    subtitle: 'Create sessions & manage students',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    borderActive: 'border-emerald-500 ring-4 ring-emerald-100',
    features: [
      'Create & publish your sessions',
      'Set your own pricing & schedule',
      'Manage bookings & students',
      'Track revenue & performance'
    ]
  }
];

export default function Onboarding() {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, fetchUser } = useAuthStore();
  const navigate = useNavigate();

  // If already onboarded, redirect
  if (user?.onboarded) {
    navigate(user.role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard');
    return null;
  }

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('tyt_token');
      await axios.patch(`${API}/api/auth/role`, { role: selected }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Re-fetch user to get the updated role
      await fetchUser();
      const updatedUser = useAuthStore.getState().user;

      if (updatedUser) {
        navigate(updatedUser.role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard');
      }
    } catch (err) {
      console.error('Role selection failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '720px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'white',
            padding: '8px 16px',
            borderRadius: '9999px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#6366f1'
          }}>
            <Sparkles size={14} />
            Welcome to Take Your Time
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '8px',
            lineHeight: '1.2'
          }}>
            How would you like to use the platform?
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            maxWidth: '480px',
            margin: '0 auto'
          }}>
            {user?.name ? `Hey ${user.name.split(' ')[0]}! ` : ''}Choose your role to get started. You can always reach out to switch later.
          </p>
        </div>

        {/* Role Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {roles.map((role) => {
            const isActive = selected === role.id;
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                onClick={() => setSelected(role.id)}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '28px',
                  cursor: 'pointer',
                  border: `2px solid ${isActive ? (role.id === 'student' ? '#3b82f6' : '#10b981') : '#e2e8f0'}`,
                  boxShadow: isActive
                    ? `0 8px 25px ${role.id === 'student' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)'}`
                    : '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.25s ease',
                  transform: isActive ? 'translateY(-2px)' : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Selection indicator */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: role.id === 'student' ? '#3b82f6' : '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: role.id === 'student'
                    ? (isActive ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : '#eff6ff')
                    : (isActive ? 'linear-gradient(135deg, #10b981, #14b8a6)' : '#ecfdf5'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  transition: 'all 0.25s ease'
                }}>
                  <Icon size={24} color={isActive ? 'white' : (role.id === 'student' ? '#3b82f6' : '#10b981')} />
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#0f172a',
                  marginBottom: '4px'
                }}>
                  {role.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#94a3b8',
                  marginBottom: '20px'
                }}>
                  {role.subtitle}
                </p>

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {role.features.map((f, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '13px',
                      color: '#475569',
                      padding: '6px 0'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: role.id === 'student' ? '#3b82f6' : '#10b981',
                        flexShrink: 0
                      }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleContinue}
            disabled={!selected || loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 36px',
              fontSize: '15px',
              fontWeight: '600',
              borderRadius: '12px',
              border: 'none',
              cursor: selected && !loading ? 'pointer' : 'not-allowed',
              background: selected
                ? (selected === 'student'
                  ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                  : 'linear-gradient(135deg, #10b981, #14b8a6)')
                : '#cbd5e1',
              color: 'white',
              transition: 'all 0.25s ease',
              opacity: loading ? 0.7 : 1,
              boxShadow: selected ? '0 4px 15px rgba(0,0,0,0.15)' : 'none'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite'
                }} />
                Setting up...
              </>
            ) : (
              <>
                Continue as {selected === 'tutor' ? 'Tutor' : selected === 'student' ? 'Student' : '...'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );
}
