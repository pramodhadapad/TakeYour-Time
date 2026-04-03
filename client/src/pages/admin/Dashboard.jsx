import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import axios from 'axios';
import { LogOut } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchMetrics();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter]);

  const fetchMetrics = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/metrics`, { headers });
      setMetrics(res.data.metrics);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/admin/users`, {
        headers,
        params: { page, limit: 15, search, role: roleFilter }
      });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (userId) => {
    try {
      await axios.patch(`${API}/api/admin/users/${userId}/ban`, {}, { headers });
      fetchUsers();
    } catch (err) {
      console.error('Ban toggle failed:', err);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login', { replace: true });
  };

  const StatCard = ({ label, value, icon, color }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value ?? '—'}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color.replace('text-', 'bg-').replace('600', '50')} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Take Your Time
            </Link>
            <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 hidden sm:inline">Welcome, {user?.name}</span>
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
            <button 
              onClick={handleLogoutClick}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 font-medium transition-colors border-l border-slate-200 pl-4"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Platform Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your SaaS platform health and user management.</p>
        </div>

        {/* Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <StatCard label="Total Users" value={metrics.totalUsers} icon="👥" color="text-violet-600" />
            <StatCard label="Total Tutors" value={metrics.totalTutors} icon="🎓" color="text-blue-600" />
            <StatCard label="Total Students" value={metrics.totalStudents} icon="📚" color="text-emerald-600" />
            <StatCard label="Total Bookings" value={metrics.totalBookings} icon="📅" color="text-amber-600" />
            <StatCard label="Active Sessions" value={metrics.totalSessions} icon="🎯" color="text-cyan-600" />
            <StatCard label="Revenue (₹)" value={metrics.totalRevenue.toLocaleString()} icon="💰" color="text-green-600" />
            <StatCard label="Bookings (7d)" value={metrics.recentBookings} icon="📈" color="text-pink-600" />
            <StatCard
              label="Cancellations"
              value={metrics.statusBreakdown?.cancelled || 0}
              icon="❌"
              color="text-red-600"
            />
          </div>
        )}

        {/* Booking Status Breakdown */}
        {metrics?.statusBreakdown && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Booking Status Breakdown</h2>
            <div className="flex flex-wrap gap-4">
              {Object.entries(metrics.statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg">
                  <span className={`w-3 h-3 rounded-full ${
                    status === 'confirmed' ? 'bg-green-500' :
                    status === 'pending' ? 'bg-yellow-500' :
                    status === 'cancelled' ? 'bg-red-500' :
                    status === 'completed' ? 'bg-blue-500' :
                    'bg-slate-400'
                  }`} />
                  <span className="capitalize text-sm font-medium text-slate-700">{status}</span>
                  <span className="text-sm font-bold text-slate-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Management */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-lg font-semibold text-slate-800">User Management</h2>
            <div className="flex gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="flex-1 sm:w-64 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">All Roles</option>
                <option value="student">Students</option>
                <option value="tutor">Tutors</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-25 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm">
                            {u.name?.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium text-slate-800 text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-500">{u.email}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        u.role === 'tutor' ? 'bg-blue-50 text-blue-600' :
                        u.role === 'student' ? 'bg-green-50 text-green-600' :
                        u.role === 'admin' ? 'bg-red-50 text-red-600' :
                        'bg-slate-50 text-slate-500'
                      }`}>
                        {u.role || 'none'}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        u.isBanned ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {u.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="py-4">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleBan(u._id)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            u.isBanned
                              ? 'bg-green-50 text-green-600 hover:bg-green-100'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {u.isBanned ? 'Unban' : 'Ban'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Showing {((page - 1) * (pagination.limit || 15)) + 1} to {Math.min(page * (pagination.limit || 15), pagination.total)} of {pagination.total} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center animate-slide-up">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={28} className="text-red-500 ml-1" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Log out</h3>
            <p className="text-slate-500 mb-6">Are you sure you want to log out of your admin session?</p>
            <div className="flex gap-3">
              <button 
                className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                onClick={confirmLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
