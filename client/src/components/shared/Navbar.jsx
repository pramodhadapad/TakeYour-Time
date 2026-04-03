import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Button } from '../ui/button';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-md z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-slate-900 tracking-tight">
          Take<span className="text-brand-primary">YourTime</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/browse" className="text-sm font-medium text-slate-600 hover:text-brand-primary hidden sm:block mr-2">
            Find Tutors
          </Link>
          {user ? (
            <>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <User size={18} />
                )}
                <span className="hidden sm:inline font-medium">{user.name}</span>
              </div>
              <Link to={user.role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard'}>
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogoutClick}>
                <LogOut size={16} />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost">Log In</Button></Link>
              <Link to="/login"><Button>Get Started</Button></Link>
            </>
          )}
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center animate-slide-up">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={28} className="text-red-500 ml-1" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Log out</h3>
            <p className="text-slate-500 mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={confirmLogout}>
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
