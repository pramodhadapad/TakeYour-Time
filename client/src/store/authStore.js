import { create } from 'zustand';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('tyt_token') || null,
  loading: !!localStorage.getItem('tyt_token'),

  setToken: (token) => {
    localStorage.setItem('tyt_token', token);
    set({ token });
  },

  fetchUser: async () => {
    const token = localStorage.getItem('tyt_token');
    if (!token) return;
    set({ loading: true });
    try {
      const { data } = await axios.get(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: data.data, loading: false });
    } catch {
      localStorage.removeItem('tyt_token');
      set({ user: null, token: null, loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('tyt_token');
    set({ user: null, token: null });
  }
}));

// Sync across tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'tyt_token') {
      // If token changed in another tab, refresh our local state
      useAuthStore.getState().fetchUser();
    }
  });
}

export default useAuthStore;
