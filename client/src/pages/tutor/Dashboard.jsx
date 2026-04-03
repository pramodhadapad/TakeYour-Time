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
      addToast({ type: 'error', message: err.response?.data?.error || err.message || 'Failed to save class.' });
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
      if (!slotForm.sessionId) return addToast({ type: 'error', message: 'Please select a class first.' });

      const startDateTime = new Date(`${slotForm.date}T${slotForm.startTime}:00`);
      let endDateTime = new Date(`${slotForm.date}T${slotForm.endTime}:00`);
      
      // Handle slots spanning past midnight
      if (endDateTime <= startDateTime) {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }
      
      const payload = {
        sessionId: slotForm.sessionId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        capacity: slotForm.capacity || 1
      };

      await slotService.createSlot(payload);
      addToast({ type: 'success', message: 'Slot created successfully.' });
      setShowSlotModal(false);
      setSlotForm({ sessionId: '', date: '', startTime: '', endTime: '', capacity: 1 });
      loadData();
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.error || err.message || 'Failed to create slot.' });
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
    <div className="min-h-screen bg-surface font-body text-on-surface selection:bg-on-primary-container/30 pb-20">
      <Navbar />

      {/* Header with Executive layout */}
      <header className="px-6 lg:px-12 py-10 bg-white/70 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-end border-b border-indigo-500/5 mt-16 shadow-sm">
        <div>
          <p className="text-slate-500 font-medium text-sm mb-1 uppercase tracking-[0.2em]">
            {new Date().toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <h2 className="text-4xl font-headline font-bold text-primary tracking-tight">Executive Overview</h2>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge variant={user?.tutorProfile?.isPublic ? 'success' : 'secondary'} className="px-4 py-2 uppercase tracking-widest text-xs shadow-sm">
            Profile {user?.tutorProfile?.isPublic ? 'Public' : 'Private'}
          </Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-2 bg-surface-container-high rounded-full p-1.5 mb-10 overflow-x-auto custom-scrollbar shadow-inner relative z-10 w-fit max-w-full">
          {tabs.map((t) => (
             <button
              key={t.key}
              className={`flex-1 min-w-max py-2.5 px-6 text-sm font-bold rounded-full transition-all shadow-sm ${activeTab === t.key ? 'bg-white text-primary shadow-ambient' : 'text-on-surface-variant hover:text-primary hover:bg-white/50'}`}
              onClick={() => setActiveTab(t.key)}
            >{t.label}</button>
          ))}
        </div>

        {/* Overview List */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* KPI Bento Grid */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="col-span-1 p-6 bg-white rounded-3xl shadow-sm border border-indigo-50/50 flex flex-col justify-between h-40 group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center material-symbols-outlined">payments</span>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                  <h3 className="text-2xl font-headline font-bold text-primary">₹{stats.monthRevenue || 0}</h3>
                </div>
              </div>
              <div className="col-span-1 p-6 bg-white rounded-3xl shadow-sm border border-indigo-50/50 flex flex-col justify-between h-40 group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <span className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center material-symbols-outlined">groups</span>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Students</p>
                  <h3 className="text-2xl font-headline font-bold text-primary">{students.length}</h3>
                </div>
              </div>
              <div className="col-span-1 p-6 bg-white rounded-3xl shadow-sm border border-indigo-50/50 flex flex-col justify-between h-40 group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Month Bookings</p>
                  <h3 className="text-2xl font-headline font-bold text-primary">{stats.monthBookings || 0}</h3>
                </div>
              </div>
              <div className="col-span-1 p-6 bg-primary text-white rounded-3xl shadow-xl shadow-indigo-900/20 flex flex-col justify-between h-40 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                  <span className="material-symbols-outlined text-8xl">star</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center material-symbols-outlined">feedback</span>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">No-Show Rate</p>
                  <h3 className="text-2xl font-headline font-bold">{stats.noShowRate || 0}%</h3>
                </div>
              </div>
            </section>

            {/* Main Content: Schedule & Analytics */}
            <section className="grid grid-cols-12 gap-10">
              <div className="col-span-12 lg:col-span-7 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-headline font-bold text-primary">Upcoming Classes</h3>
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-indigo-50/50 shadow-sm space-y-4">
                  {bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').slice(0, 5).length > 0 ? (
                    bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').slice(0, 5).map(b => (
                      <div key={b._id} className={`flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors group relative border-l-4 ${b.status === 'confirmed' ? 'border-indigo-500' : 'border-amber-400'}`}>
                        <span className="text-sm font-bold text-slate-400 w-16">{new Date(b.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-primary">{b.sessionId?.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">Student: {b.studentId?.name || 'Unknown'} • <span className="uppercase tracking-widest">{b.status}</span></p>
                        </div>
                        <div className="flex gap-2">
                           {b.status === 'pending' && (
                             <button onClick={() => handleStatusUpdate(b._id, 'confirmed')} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-all shadow-sm">
                               <span className="material-symbols-outlined text-[18px]">check</span>
                             </button>
                           )}
                           {b.status === 'confirmed' && (
                             <button onClick={() => handleStatusUpdate(b._id, 'no_show')} className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-all shadow-sm">
                               <span className="material-symbols-outlined text-[18px]">person_off</span>
                             </button>
                           )}
                           <button onClick={() => handleStatusUpdate(b._id, 'cancelled')} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-all shadow-sm">
                             <span className="material-symbols-outlined text-[18px]">close</span>
                           </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-on-surface-variant font-medium">No upcoming sessions right now.</div>
                  )}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-5 space-y-6">
                <h3 className="text-xl font-headline font-bold text-primary">Recent Students</h3>
                <div className="bg-white rounded-[2rem] border border-indigo-50/50 shadow-sm overflow-hidden p-6 space-y-4">
                   {students.slice(0, 5).length > 0 ? students.slice(0, 5).map((s, idx) => (
                      <div key={s._id} className={`flex items-center gap-4 ${idx !== 0 ? 'pt-4 border-t border-slate-100' : ''}`}>
                         <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container flex items-center justify-center text-primary font-bold">
                           {s.avatar ? <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" /> : s.name?.charAt(0)}
                         </div>
                         <div className="flex-1">
                            <h5 className="text-sm font-bold text-primary">{s.name}</h5>
                            <p className="text-[11px] text-slate-500">{s.email}</p>
                         </div>
                      </div>
                   )) : (
                     <div className="text-center py-4 text-on-surface-variant font-medium">No students yet.</div>
                   )}
                </div>
                
                <div className="bg-white p-6 rounded-[2rem] border border-indigo-50/50 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-50 flex items-center justify-center border-t-indigo-600">
                      <span className="text-[10px] font-bold text-indigo-600">{stats.noShowRate || 0}%</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">No-Show Rate</p>
                      <p className="text-[11px] text-slate-400">Excellent performance</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-emerald-500" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h3 className="text-xl font-headline font-bold text-primary mb-6">Booking History</h3>
            {bookings.length === 0 ? (
               <div className="bg-white rounded-[2rem] p-10 text-center text-on-surface-variant shadow-sm border border-indigo-50/50">No bookings yet.</div>
            ) : bookings.map((b) => (
               <div key={b._id} className="bg-white rounded-[2rem] border border-indigo-50/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-ambient transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h5 className="font-bold text-primary">{b.sessionId?.title || 'Session'}</h5>
                    <Badge variant={statusColors[b.status]}>{b.status}</Badge>
                    <span className="text-sm font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md">₹{b.sessionId?.price}</span>
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">person</span> {b.studentId?.name || 'Student'} • 
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span> {new Date(b.scheduledAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  {b.status === 'confirmed' && (
                     <>
                      <button className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-1" onClick={() => handleStatusUpdate(b._id, 'completed')}>
                        <span className="material-symbols-outlined text-[14px]">check</span> Complete
                      </button>
                      <button className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-xl transition-colors" onClick={() => handleStatusUpdate(b._id, 'no_show')}>
                        No-Show
                      </button>
                     </>
                  )}
                  {['completed', 'cancelled', 'no_show'].includes(b.status) && (
                    <button className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-1" onClick={() => handleDeleteBooking(b._id)}>
                      <span className="material-symbols-outlined text-[14px]">delete</span> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Slot Management Tab */}
        {activeTab === 'slots' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-headline font-bold text-primary">Availability Slots</h3>
              <button 
                onClick={() => setShowSlotModal(true)} 
                className="btn-ghost"
              >
                <span className="material-symbols-outlined text-[18px]">add</span> Add Slot
              </button>
            </div>
            
            {slots.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-10 text-center text-on-surface-variant shadow-sm border border-indigo-50/50">No slots defined. Create a slot to let students book you!</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slots.map((slot) => (
                  <div key={slot._id} className={`bg-white rounded-[2rem] border p-6 flex flex-col justify-between h-48 relative overflow-hidden group hover:shadow-ambient transition-all ${slot.bookedCount >= slot.capacity ? 'border-rose-100' : 'border-indigo-50/50'}`}>
                    {slot.bookedCount >= slot.capacity && (
                       <div className="absolute top-0 left-0 w-full h-1 bg-rose-400"></div>
                    )}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-primary">{slot.sessionId?.title || 'General Availability'}</h4>
                        <p className="text-xs text-slate-500 mt-1">{new Date(slot.startTime).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={slot.bookedCount >= slot.capacity ? 'destructive' : 'success'} className="scale-90 origin-top-right">
                        {slot.bookedCount >= slot.capacity ? 'Full' : `${slot.capacity - slot.bookedCount} Left`}
                      </Badge>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-surface-container w-fit px-3 py-1.5 rounded-lg mb-4">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div className="flex gap-2">
                        <button disabled={slot.bookedCount > 0} onClick={() => handleDeleteSlot(slot._id)} className="text-xs font-bold text-rose-600 hover:text-rose-700 disabled:opacity-50 transition-colors uppercase tracking-widest flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">delete</span> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-headline font-bold text-primary">My Classes</h3>
              <button onClick={() => setShowClassModal(true)} className="btn-ghost">
                <span className="material-symbols-outlined text-[18px]">add</span> Create Class
              </button>
            </div>
            
            {sessions.length === 0 ? (
               <div className="bg-white rounded-[2rem] p-10 text-center text-on-surface-variant shadow-sm border border-indigo-50/50">
                You haven't added any classes yet. Add one to let students book.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map(s => (
                  <div key={s._id} className="bg-white rounded-[2rem] border border-indigo-50/50 p-6 flex flex-col justify-between h-56 shadow-sm hover:shadow-ambient transition-all group">
                     <div>
                       <div className="flex justify-between items-start mb-4">
                         <Badge variant={s.type === 'group' ? 'secondary' : 'default'} className="uppercase tracking-widest text-[10px]">{s.type}</Badge>
                         <span className="text-sm font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md">{s.currency || 'INR'} {s.price}</span>
                       </div>
                       <h3 className="font-headline font-bold text-primary text-xl leading-tight mb-2 group-hover:text-amber-500 transition-colors">{s.title}</h3>
                       <div className="text-sm text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-2">
                         <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> {s.durationMinutes} min</span>
                         {s.type === 'group' && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">group</span> Max {s.maxCapacity}</span>}
                       </div>
                     </div>
                     <div className="mt-4 pt-4 border-t border-indigo-50/50 flex justify-between">
                       <button onClick={() => handleEditClass(s)} className="text-sm font-bold text-primary hover:text-amber-600 transition-colors flex items-center gap-1">
                         <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                       </button>
                       <button onClick={() => handleDeleteClass(s._id)} className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1">
                         <span className="material-symbols-outlined text-[16px]">delete</span> Delete
                       </button>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Students tab */}
        {activeTab === 'students' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {students.length === 0 ? (
               <div className="col-span-full bg-white rounded-[2rem] p-10 text-center text-on-surface-variant shadow-sm border border-indigo-50/50">No students yet. Share your booking link to get started!</div>
            ) : students.map((s) => (
              <div key={s._id} className="bg-white rounded-[2rem] border border-indigo-50/50 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-ambient transition-all">
                <div className="w-20 h-20 rounded-3xl overflow-hidden bg-surface-container flex flex-shrink-0 items-center justify-center text-primary font-headline text-3xl mb-4 shadow-inner">
                   {s.avatar ? <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" /> : s.name?.charAt(0)}
                </div>
                <h4 className="font-bold text-primary mb-1">{s.name}</h4>
                <p className="text-xs text-slate-500 truncate w-full">{s.email}</p>
                <button className="mt-4 w-full py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl hover:bg-indigo-100 transition-colors">
                  Message
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-[2rem] border border-indigo-50/50 shadow-sm overflow-hidden p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-headline font-bold text-primary">Profile Settings</h3>
                <p className="text-slate-500 mt-1">Manage your public presence and booking preferences.</p>
              </div>
              <form onSubmit={handleProfileSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Public Marketplace Slug</label>
                  <div className="flex items-center group">
                    <span className="bg-surface-container-high px-4 py-3 text-slate-500 text-sm font-medium rounded-l-2xl border-r border-indigo-500/10">/book/</span>
                    <input type="text" disabled className="w-full px-4 py-3 bg-surface-container text-slate-500 rounded-r-2xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium" value={profileForm.slug || 'Save profile to generate'} />
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-medium">This is your unique booking link. It is generated automatically.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Bio / Qualifications</label>
                  <textarea rows={4} className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium resize-none shadow-inner" value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} placeholder="Tell students about your teaching experience..."></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Subjects (Comma separated)</label>
                  <input type="text" className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium shadow-inner" value={profileForm.subjects} onChange={e => setProfileForm({...profileForm, subjects: e.target.value})} placeholder="Math, Physics, Piano..." />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Cancellation Policy (Hours before)</label>
                  <input type="number" min="0" className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium shadow-inner" value={profileForm.cancellationHours} onChange={e => setProfileForm({...profileForm, cancellationHours: parseInt(e.target.value)})} />
                </div>
                
                <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/10 mt-8">
                  <div>
                    <h4 className="font-bold text-primary text-lg">Make Profile Public</h4>
                    <p className="text-sm text-slate-500 font-medium">Allow students to discover you on the marketplace.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input type="checkbox" className="sr-only peer" checked={profileForm.isPublic} onChange={e => setProfileForm({...profileForm, isPublic: e.target.checked})} />
                    <div className="w-14 h-8 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-400 shadow-inner"></div>
                  </label>
                </div>
                
                <div className="pt-6">
                  <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-colors shadow-lg shadow-indigo-900/10">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {/* Modals */}
      {showClassModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 border border-indigo-50/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-headline font-bold text-primary">{editingClassId ? 'Edit Class' : 'Create New Class'}</h3>
              <button 
                onClick={() => {
                  setShowClassModal(false);
                  setEditingClassId(null);
                  setClassForm({ title: '', type: 'solo', durationMinutes: 60, price: 50, mode: 'online', currency: 'INR', maxCapacity: 1 });
                }} 
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              ><span className="material-symbols-outlined text-[20px]">close</span></button>
            </div>
            <form onSubmit={handleCreateClass} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Title</label>
                <input required type="text" className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium border border-transparent shadow-inner" value={classForm.title} onChange={e => setClassForm({...classForm, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Type</label>
                  <select className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium border border-transparent shadow-inner" value={classForm.type} onChange={e => setClassForm({...classForm, type: e.target.value})}>
                    <option value="solo">Individual</option>
                    <option value="group">Group</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Mode</label>
                  <select className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium border border-transparent shadow-inner" value={classForm.mode} onChange={e => setClassForm({...classForm, mode: e.target.value})}>
                    <option value="online">Online</option>
                    <option value="offline">In-Person</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Duration (min)</label>
                  <input type="number" required className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium border border-transparent shadow-inner" value={classForm.durationMinutes} onChange={e => setClassForm({...classForm, durationMinutes: parseInt(e.target.value) || 60})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Price</label>
                  <input type="number" required className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium border border-transparent shadow-inner" value={classForm.price} onChange={e => setClassForm({...classForm, price: parseFloat(e.target.value) || 0})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Currency</label>
                <select className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium border border-transparent shadow-inner" value={classForm.currency} onChange={e => setClassForm({...classForm, currency: e.target.value})}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              {classForm.type === 'group' && (
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Max Capacity</label>
                  <input type="number" min="1" className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium border border-transparent shadow-inner" value={classForm.maxCapacity} onChange={e => setClassForm({...classForm, maxCapacity: parseInt(e.target.value) || 1})} />
                </div>
              )}
              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-colors shadow-lg shadow-indigo-900/10">
                  {editingClassId ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSlotModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 border border-indigo-50/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-headline font-bold text-primary">Create Availability Slot</h3>
              <button 
                onClick={() => setShowSlotModal(false)}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                ><span className="material-symbols-outlined text-[20px]">close</span></button>
            </div>
            <form onSubmit={handleCreateSlot} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Class</label>
                <select required className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium border border-transparent shadow-inner" value={slotForm.sessionId} onChange={e => {
                  const sel = sessions.find(s => s._id === e.target.value);
                  setSlotForm({...slotForm, sessionId: e.target.value, capacity: sel?.maxCapacity || 1})
                }}>
                  <option value="">Select a class...</option>
                  {sessions.map(s => <option key={s._id} value={s._id}>{s.title} ({s.type})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Date</label>
                <input required type="date" className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium border border-transparent shadow-inner" value={slotForm.date} onChange={e => setSlotForm({...slotForm, date: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Start Time</label>
                  <input required type="time" className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium border border-transparent shadow-inner" value={slotForm.startTime} onChange={e => setSlotForm({...slotForm, startTime: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">End Time</label>
                  <input required type="time" className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium border border-transparent shadow-inner" value={slotForm.endTime} onChange={e => setSlotForm({...slotForm, endTime: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Capacity for this slot</label>
                <input required type="number" min="1" className="w-full bg-surface-container rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium border border-transparent shadow-inner" value={slotForm.capacity} onChange={e => setSlotForm({...slotForm, capacity: parseInt(e.target.value) || 1})} />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-colors shadow-lg shadow-indigo-900/10">Publish Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
