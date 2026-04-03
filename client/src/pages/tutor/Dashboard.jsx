import React, { useEffect, useState } from 'react';
import bookingService from '../../services/bookingService';
import { sessionService, slotService } from '../../services/marketplaceService';
import useNotificationStore from '../../store/notificationStore';
import useAuthStore from '../../store/authStore';
import Navbar from '../../components/shared/Navbar';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar, Users, IndianRupee, AlertTriangle, Check, X, Clock, Plus, Trash2 } from 'lucide-react';

const statusColors = {
  confirmed: 'success',
  pending: 'warning',
  cancelled: 'destructive',
  completed: 'secondary',
  no_show: 'destructive'
};

export default function TutorDashboard() {
  const [stats, setStats] = useState({ totalBookings: 0, monthBookings: 0, monthRevenue: 0, noShowRate: 0 });
  const [bookings, setBookings] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]); // Array of tutor's classes
  const [slots, setSlots] = useState([]); // Array of availability slots
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { user, fetchUser } = useAuthStore();
  
  const [profileForm, setProfileForm] = useState({
    bio: user?.tutorProfile?.bio || '',
    subjects: user?.tutorProfile?.subjects?.join(', ') || '',
    cancellationHours: user?.tutorProfile?.cancellationHours || 24,
    isPublic: user?.tutorProfile?.isPublic || false,
    slug: user?.tutorProfile?.slug || ''
  });
  
  // Modals state
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [classForm, setClassForm] = useState({ title: '', type: 'solo', durationMinutes: 60, price: 0, currency: 'INR', maxCapacity: 1, mode: 'online' });
  
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [slotForm, setSlotForm] = useState({ sessionId: '', date: '', startTime: '', endTime: '', capacity: 1 });

  const { addToast } = useNotificationStore();

  const loadData = async () => {
    try {
      // In a real app we'd fetch actual specific tutor sessions and slots.
      // E.g. sessionService.getTutorSessions() 
      // Need to add this endpoint or simulate it for now.
      
      const [statsRes, bookingsRes, studentsRes, slotsRes, sessionsRes] = await Promise.all([
        bookingService.getTutorDashboardStats(),
        bookingService.getTutorBookings(),
        bookingService.getTutorStudents(),
        slotService.getTutorSlots().catch(() => ({ data: { data: [] } })),
        sessionService.getTutorSessions().catch(() => ({ data: { data: [] } }))
      ]);
      setStats(statsRes.data.data);
      setBookings(bookingsRes.data.data);
      setStudents(studentsRes.data.data);
      setSlots(slotsRes.data.data || []);
      setSessions(sessionsRes.data.data || []);
    } catch {
      addToast({ type: 'error', message: 'Failed to load dashboard.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      addToast({ type: 'success', message: `Booking marked as ${status}.` });
      loadData();
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Update failed.' });
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    try {
      await slotService.deleteSlot(id);
      addToast({ type: 'success', message: 'Slot deleted successfully.' });
      loadData();
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Failed to delete slot.' });
    }
  };

  const handleDeleteClass = async (id) => {
    if (!confirm('Are you sure you want to delete this class? This cannot be undone.')) return;
    try {
      await sessionService.deleteSession(id);
      addToast({ type: 'success', message: 'Class deleted successfully.' });
      loadData();
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Failed to delete class.' });
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm('Delete this booking from your history?')) return;
    try {
      await bookingService.deleteBooking(id);
      addToast({ type: 'success', message: 'Booking deleted.' });
      loadData();
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Failed to delete booking.' });
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...profileForm,
        subjects: profileForm.subjects.split(',').map(s => s.trim()).filter(s => s)
      };
      await sessionService.updateProfile(payload);
      addToast({ type: 'success', message: 'Profile updated successfully!' });
      fetchUser(); // reload the user info in global state
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Failed to update profile.' });
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      if (editingClassId) {
        await sessionService.updateSession(editingClassId, classForm);
        addToast({ type: 'success', message: 'Class updated successfully.' });
      } else {
        await sessionService.createSession(classForm);
        addToast({ type: 'success', message: 'Class created successfully.' });
      }
      setShowClassModal(false);
      setEditingClassId(null);
      setClassForm({ title: '', type: 'solo', durationMinutes: 60, price: 50, mode: 'online', currency: 'INR', maxCapacity: 1 });
      loadData();
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Failed to save class.' });
    }
  };

  const handleEditClass = (session) => {
    setEditingClassId(session._id);
    setClassForm({
      title: session.title,
      type: session.type,
      durationMinutes: session.durationMinutes,
      price: session.price,
      mode: session.mode || 'online',
      currency: session.currency || 'INR',
      maxCapacity: session.maxCapacity || 1,
    });
    setShowClassModal(true);
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      const startDateTime = new Date(`${slotForm.date}T${slotForm.startTime}:00`);
      const endDateTime = new Date(`${slotForm.date}T${slotForm.endTime}:00`);
      
      const payload = {
        sessionId: slotForm.sessionId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        capacity: slotForm.capacity
      };

      await slotService.createSlot(payload);
      addToast({ type: 'success', message: 'Slot created successfully.' });
      setShowSlotModal(false);
      loadData();
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Failed to create slot.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'slots', label: 'Slot Management' },
    { key: 'classes', label: 'My Classes' },
    { key: 'students', label: 'Students' },
    { key: 'profile', label: 'Profile Settings' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {/* Header with gradient */}
      <div className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #7C3AED 50%, #a78bfa 100%)',
        padding: '48px 0 64px',
      }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in-up">Tutor Dashboard</h1>
          <p className="text-white/60 animate-fade-in-up delay-100">Manage your sessions, bookings, and students.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 -mt-8 relative z-10">

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-8 overflow-x-auto">
          {tabs.map((t) => (
             <button
              key={t.key}
              className={`flex-1 min-w-max py-2 px-4 text-sm font-medium rounded-md transition-all ${activeTab === t.key ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab(t.key)}
            >{t.label}</button>
          ))}
        </div>

        {/* Overview List */}
        {activeTab === 'overview' && (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-10">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-brand-primary"><Calendar size={20}/></div>
                    <div>
                      <p className="text-2xl font-bold">{stats.monthBookings}</p>
                      <p className="text-xs text-slate-500">This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-status-success"><IndianRupee size={20}/></div>
                    <div>
                      <p className="text-2xl font-bold">₹{stats.monthRevenue}</p>
                      <p className="text-xs text-slate-500">Revenue (Month)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-brand-accent"><Users size={20}/></div>
                    <div>
                      <p className="text-2xl font-bold">{students.length}</p>
                      <p className="text-xs text-slate-500">Total Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-status-danger"><AlertTriangle size={20}/></div>
                    <div>
                      <p className="text-2xl font-bold">{stats.noShowRate}%</p>
                      <p className="text-xs text-slate-500">No-Show Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent bookings */}
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Bookings</h2>
            <div className="space-y-3">
              {bookings.slice(0, 5).map((b) => (
                <Card key={b._id}>
                  <CardContent className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-slate-900">{b.studentId?.name || 'Student'}</span>
                        <Badge variant={statusColors[b.status]}>{b.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>{b.sessionId?.title}</span>
                        <span className="flex items-center gap-1"><Clock size={12}/>{new Date(b.scheduledAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       {b.status === 'pending' && (
                        <Button size="sm" onClick={() => handleStatusUpdate(b._id, 'confirmed')}>
                          <Check size={14} className="mr-1"/> Confirm
                        </Button>
                      )}
                      {b.status === 'confirmed' && (
                         <Button variant="destructive" size="sm" onClick={() => handleStatusUpdate(b._id, 'no_show')}>
                          <X size={14} className="mr-1"/> No-Show
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Bookings tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <Card><CardContent className="py-10 text-center text-slate-500">No bookings yet.</CardContent></Card>
            ) : bookings.map((b) => (
               <Card key={b._id}>
                <CardContent className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-slate-900">{b.studentId?.name || 'Student'}</span>
                      <Badge variant={statusColors[b.status]}>{b.status}</Badge>
                      <Badge variant="outline">₹{b.sessionId?.price}</Badge>
                    </div>
                    <div className="text-sm text-slate-500">{b.sessionId?.title} · {new Date(b.scheduledAt).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    {b.status === 'confirmed' && (
                       <>
                        <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(b._id, 'completed')}>
                          <Check size={14} className="mr-1"/> Complete
                        </Button>
                         <Button variant="destructive" size="sm" onClick={() => handleStatusUpdate(b._id, 'no_show')}>
                          No-Show
                        </Button>
                       </>
                    )}
                    {['completed', 'cancelled', 'no_show'].includes(b.status) && (
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteBooking(b._id)}>
                        <Trash2 size={14} className="mr-1"/> Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Slot Management Tab */}
        {activeTab === 'slots' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Availability Slots</h2>
              <Button onClick={() => setShowSlotModal(true)}><Plus size={16} className="mr-2"/> Create Slot</Button>
            </div>
            
            {slots.length === 0 ? (
              <Card><CardContent className="py-10 text-center text-slate-500">No slots defined. Create a slot to let students book you!</CardContent></Card>
            ) : (
              <div className="space-y-4">
                {slots.map((slot) => (
                  <Card key={slot._id} className={slot.bookedCount >= slot.capacity ? 'border-red-200 bg-red-50' : ''}>
                    <CardContent className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-slate-900">{slot.sessionId?.title || 'General Slot'}</h3>
                          {slot.bookedCount >= slot.capacity ? (
                            <Badge variant="destructive">Full ({slot.bookedCount}/{slot.capacity})</Badge>
                          ) : (
                            <Badge variant="success">Available ({slot.capacity - slot.bookedCount} left)</Badge>
                          )}
                        </div>
                        <div className="text-sm text-slate-500 flex items-center gap-4">
                          <span>{new Date(slot.startTime).toLocaleDateString()}</span>
                          <span>{new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteSlot(slot._id)} disabled={slot.bookedCount > 0}>
                          <Trash2 size={14} className="mr-1"/> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <div>
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Classes</h2>
              <Button onClick={() => setShowClassModal(true)}><Plus size={16} className="mr-2"/> Create Class</Button>
            </div>
            
            {sessions.length === 0 ? (
              <Card><CardContent className="py-10 text-center text-slate-500">
                You haven't added any classes yet. Add one to let students book.
              </CardContent></Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {sessions.map(s => (
                  <Card key={s._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="py-5">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={s.type === 'group' ? 'secondary' : 'default'}>{s.type}</Badge>
                        <Badge variant="outline">{s.currency || 'INR'} {s.price}</Badge>
                      </div>
                      <h3 className="font-bold text-lg">{s.title}</h3>
                      <div className="text-sm text-slate-500 mt-2 flex items-center gap-4">
                        <span className="flex items-center gap-1"><Clock size={14}/> {s.durationMinutes} min</span>
                        {s.type === 'group' && <span className="flex items-center gap-1"><Users size={14}/> Max {s.maxCapacity}</span>}
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClass(s)} className="flex-1">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClass(s._id)} className="flex-1">
                          <Trash2 size={14} className="mr-1" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Students tab */}
        {activeTab === 'students' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.length === 0 ? (
               <Card className="md:col-span-3"><CardContent className="py-10 text-center text-slate-500">No students yet. Share your booking link to get started!</CardContent></Card>
            ) : students.map((s) => (
              <Card key={s._id} className="hover:shadow-sm transition-shadow">
                <CardContent className="py-5 flex items-center gap-4">
                  {s.avatar ? (
                     <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full" />
                  ) : (
                     <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">{s.name?.charAt(0)}</div>
                  )}
                  <div>
                     <p className="font-semibold text-slate-900">{s.name}</p>
                     <p className="text-sm text-slate-500">{s.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Public Marketplace Slug</label>
                  <div className="flex items-center">
                    <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-md px-3 py-2 text-slate-500 text-sm">/book/</span>
                    <input type="text" disabled className="w-full border rounded-r-md px-3 py-2 bg-slate-50 text-slate-500" value={profileForm.slug || 'Save profile to generate'} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">This is your unique booking link. It is generated automatically.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bio / Qualifications</label>
                  <textarea rows={4} className="w-full border rounded-md px-3 py-2" value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} placeholder="Tell students about your teaching experience..."></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subjects (Comma separated)</label>
                  <input type="text" className="w-full border rounded-md px-3 py-2" value={profileForm.subjects} onChange={e => setProfileForm({...profileForm, subjects: e.target.value})} placeholder="Math, Physics, Piano..." />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cancellation Policy (Hours before)</label>
                  <input type="number" min="0" className="w-full border rounded-md px-3 py-2" value={profileForm.cancellationHours} onChange={e => setProfileForm({...profileForm, cancellationHours: parseInt(e.target.value)})} />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-900">Make Profile Public</p>
                    <p className="text-sm text-slate-500">Allow students to discover you on the marketplace and book classes.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={profileForm.isPublic} onChange={e => setProfileForm({...profileForm, isPublic: e.target.checked})} />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                  </label>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Modals */}
      {showClassModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{editingClassId ? 'Edit Class' : 'Create New Class'}</h3>
              <button 
                onClick={() => {
                  setShowClassModal(false);
                  setEditingClassId(null);
                  setClassForm({ title: '', type: 'solo', durationMinutes: 60, price: 50, mode: 'online', currency: 'INR', maxCapacity: 1 });
                }} 
                className="text-slate-500 hover:text-slate-700"
              ><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input required type="text" className="w-full border rounded-md px-3 py-2" value={classForm.title} onChange={e => setClassForm({...classForm, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select className="w-full border rounded-md px-3 py-2" value={classForm.type} onChange={e => setClassForm({...classForm, type: e.target.value})}>
                    <option value="solo">Individual</option>
                    <option value="group">Group</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mode</label>
                  <select className="w-full border rounded-md px-3 py-2" value={classForm.mode} onChange={e => setClassForm({...classForm, mode: e.target.value})}>
                    <option value="online">Online</option>
                    <option value="offline">In-Person (Offline)</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration (min)</label>
                  <input type="number" required className="w-full border rounded-md px-3 py-2" value={classForm.durationMinutes} onChange={e => setClassForm({...classForm, durationMinutes: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                  <input type="number" required className="w-full border rounded-md px-3 py-2" value={classForm.price} onChange={e => setClassForm({...classForm, price: parseFloat(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                <select className="w-full border rounded-md px-3 py-2" value={classForm.currency} onChange={e => setClassForm({...classForm, currency: e.target.value})}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              {classForm.type === 'group' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Capacity</label>
                  <input type="number" min="2" className="w-full border rounded-md px-3 py-2" value={classForm.maxCapacity} onChange={e => setClassForm({...classForm, maxCapacity: parseInt(e.target.value)})} />
                </div>
              )}
              <Button type="submit" className="w-full mt-2">{editingClassId ? 'Update Class' : 'Create Class'}</Button>
            </form>
          </div>
        </div>
      )}

      {showSlotModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Create Availability Slot</h3>
              <button onClick={() => setShowSlotModal(false)} className="text-slate-500 hover:text-slate-700"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                <select required className="w-full border rounded-md px-3 py-2" value={slotForm.sessionId} onChange={e => {
                  const sel = sessions.find(s => s._id === e.target.value);
                  setSlotForm({...slotForm, sessionId: e.target.value, capacity: sel?.maxCapacity || 1})
                }}>
                  <option value="">Select a class...</option>
                  {sessions.map(s => <option key={s._id} value={s._id}>{s.title} ({s.type})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input required type="date" className="w-full border rounded-md px-3 py-2" value={slotForm.date} onChange={e => setSlotForm({...slotForm, date: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                  <input required type="time" className="w-full border rounded-md px-3 py-2" value={slotForm.startTime} onChange={e => setSlotForm({...slotForm, startTime: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                  <input required type="time" className="w-full border rounded-md px-3 py-2" value={slotForm.endTime} onChange={e => setSlotForm({...slotForm, endTime: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Capacity for this slot</label>
                <input required type="number" min="1" className="w-full border rounded-md px-3 py-2" value={slotForm.capacity} onChange={e => setSlotForm({...slotForm, capacity: parseInt(e.target.value)})} />
              </div>
              <Button type="submit" className="w-full mt-2">Publish Slot</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
