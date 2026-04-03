import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import reviewService from '../../services/reviewService';
import useNotificationStore from '../../store/notificationStore';
import Navbar from '../../components/shared/Navbar';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, X, RotateCcw, BookOpen, History, TrendingUp, Star } from 'lucide-react';

const statusColors = {
  confirmed: 'success',
  pending: 'warning',
  cancelled: 'destructive',
  completed: 'secondary',
  no_show: 'destructive'
};

export default function StudentDashboard() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState({ isOpen: false, bookingId: null, rating: 5, review: '' });
  const { addToast } = useNotificationStore();

  const loadData = async () => {
    try {
      const [upRes, pastRes] = await Promise.all([
        bookingService.getUpcoming(),
        bookingService.getPast()
      ]);
      setUpcoming(upRes.data.data);
      setPast(pastRes.data.data);
    } catch {
      addToast({ type: 'error', message: 'Failed to load dashboard.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCancel = async (id) => {
    try {
      await bookingService.cancelBooking(id);
      addToast({ type: 'success', message: 'Booking cancelled.' });
      loadData();
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Cancel failed.' });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewService.submitReview({
        bookingId: reviewModal.bookingId,
        rating: reviewModal.rating,
        review: reviewModal.review
      });
      addToast({ type: 'success', message: 'Review submitted successfully!' });
      setReviewModal({ isOpen: false, bookingId: null, rating: 5, review: '' });
      loadData();
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Failed to submit review' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface selection:bg-on-primary-container/30 pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
          <div>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary mb-2">Student Dashboard</h1>
            <p className="text-on-surface-variant font-medium">You have {upcoming.length} sessions scheduled.</p>
          </div>
          <div className="flex gap-3">
             <div className="flex bg-surface-container-lowest rounded-2xl p-2 gap-2 shadow-ambient border border-outline-variant/10">
                <div className="px-4 py-2 text-center">
                   <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Upcoming</p>
                   <p className="text-xl font-headline font-bold text-primary">{upcoming.length}</p>
                </div>
                <div className="px-4 py-2 text-center border-l border-outline-variant/10">
                   <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Completed</p>
                   <p className="text-xl font-headline font-bold text-primary">{past.filter(p => p.status === 'completed').length}</p>
                </div>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Hero: Next Session (Asymmetric Bento) */}
          <div className="col-span-12 lg:col-span-8">
             {upcoming.length > 0 ? (() => {
               const nextSession = upcoming[0];
               return (
                  <div className="relative overflow-hidden rounded-[24px_12px_24px_12px] bg-primary p-1 text-white shadow-2xl h-full flex items-center">
                    <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 overflow-hidden pointer-events-none" style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }}>
                    </div>
                    <div className="relative z-10 p-8 lg:p-10 flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                      <div className="max-w-xl">
                        <span className="inline-block px-3 py-1 rounded-full bg-on-primary-container/20 text-on-primary-container text-[11px] font-bold tracking-widest uppercase mb-6">Next Up</span>
                        <h2 className="font-headline text-3xl font-bold mb-4">{nextSession.sessionId?.title || 'Session'}</h2>
                        <div className="flex flex-wrap items-center gap-6 text-slate-300 mb-8">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span className="text-sm font-medium">
                               {new Date(nextSession.scheduledAt).toLocaleDateString()} at {new Date(nextSession.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">person</span>
                            <span className="text-sm font-medium">Tutor: {nextSession.tutor?.name || 'Tutor'}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          {nextSession.meetingLink ? (
                              <a href={nextSession.meetingLink} target="_blank" rel="noreferrer" className="bg-on-primary-container hover:bg-on-primary-container/90 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-on-primary-container/30 text-center text-sm">
                                Join Video Call
                              </a>
                           ) : (
                              <button disabled className="bg-white/10 text-white/50 px-8 py-4 rounded-full font-bold cursor-not-allowed text-sm">
                                Link unavailable
                              </button>
                           )}
                           <button onClick={() => handleCancel(nextSession._id)} className="text-white/60 hover:text-white font-bold px-6 py-4 flex items-center gap-2 text-sm transition-colors group">
                              Cancel Session
                              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
               );
             })() : (
               <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-10 bg-surface-container-lowest rounded-[24px_12px_24px_12px] shadow-ambient border border-outline-variant/10">
                  <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center mb-6 text-primary">
                    <span className="material-symbols-outlined text-3xl">event_available</span>
                  </div>
                  <h3 className="text-xl font-bold font-headline text-primary mb-2">No upcoming sessions</h3>
                  <p className="text-on-surface-variant mb-6 text-sm max-w-sm">You are all caught up. Ready to learn something new? Browse available sessions and tutors.</p>
                  <Link to="/browse" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-bold shadow-md transition-colors text-sm">
                     Browse Sessions
                  </Link>
               </div>
             )}
          </div>

          {/* Quick Shortcuts */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
             <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-ambient flex-1 border border-outline-variant/5">
                <h3 className="font-headline text-xl font-bold text-primary mb-6">Quick Links</h3>
                <div className="space-y-3">
                   <Link to="/browse" className="flex items-center justify-between p-4 rounded-2xl bg-surface hover:bg-surface-container-high transition-colors group">
                      <div className="flex items-center gap-3">
                         <div className="bg-primary/5 p-2 rounded-lg text-primary">
                            <span className="material-symbols-outlined text-sm">search</span>
                         </div>
                         <span className="font-semibold text-sm text-primary">Find a Tutor</span>
                      </div>
                      <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
                   </Link>
                   <Link to="/profile" className="flex items-center justify-between p-4 rounded-2xl bg-surface hover:bg-surface-container-high transition-colors group">
                      <div className="flex items-center gap-3">
                         <div className="bg-primary/5 p-2 rounded-lg text-primary">
                            <span className="material-symbols-outlined text-sm">person</span>
                         </div>
                         <span className="font-semibold text-sm text-primary">Update Profile</span>
                      </div>
                      <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
                   </Link>
                </div>
                
                <div className="mt-8 p-5 bg-primary-container rounded-2xl relative overflow-hidden">
                  <div className="relative z-10">
                  <p className="text-[10px] font-bold text-on-primary-container/80 uppercase tracking-widest mb-1">Resource</p>
                  <h4 className="text-white font-headline font-bold text-sm mb-3">View Active Courses</h4>
                  <Link to="/browse" className="text-xs font-bold text-white border-b border-white/40 pb-0.5 hover:border-white transition-colors">Explore Now</Link>
                  </div>
                  <span className="material-symbols-outlined absolute -bottom-4 -right-2 text-7xl text-white/5 rotate-12">auto_stories</span>
                </div>
             </div>
          </div>
          
          {/* Upcoming Schedule */}
          <div className="col-span-12 lg:col-span-6">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="font-headline text-2xl font-bold text-primary">Upcoming Schedule</h3>
            </div>
            <div className="space-y-4">
              {upcoming.length > 1 ? upcoming.slice(1).map(b => {
                const isConfirmed = b.status === 'confirmed';
                return (
                  <div key={b._id} className="group bg-surface-container-lowest p-5 rounded-3xl flex items-center justify-between transition-all hover:shadow-ambient hover:-translate-y-1 border border-outline-variant/10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-secondary-container/30 flex flex-col items-center justify-center text-primary flex-shrink-0">
                        <span className="text-[10px] font-bold uppercase">{new Date(b.scheduledAt).toLocaleDateString('en', { month: 'short' })}</span>
                        <span className="text-xl font-headline font-bold">{new Date(b.scheduledAt).getDate()}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary group-hover:text-on-primary-container transition-colors line-clamp-1">{b.sessionId?.title || 'Session'}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span> 
                          {new Date(b.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {b.tutorId?.name || 'Tutor'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap hidden sm:inline-block ${
                        isConfirmed ? 'bg-primary/5 text-primary' : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {b.status}
                      </span>
                      <button onClick={() => handleCancel(b._id)} className="p-2 text-outline hover:bg-error/10 hover:text-error rounded-xl transition-colors" title="Cancel Booking">
                         <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-8 text-center text-on-surface-variant bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/30 flex flex-col items-center">
                   <p className="text-sm font-medium">No other upcoming sessions.</p>
                </div>
              )}
            </div>
          </div>

          {/* Past Sessions */}
          <div className="col-span-12 lg:col-span-6">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="font-headline text-2xl font-bold text-primary">Past Sessions</h3>
            </div>
            <div className="space-y-4">
              {past.length > 0 ? past.map(b => (
                <div key={b._id} className="relative group bg-surface-container-lowest p-5 rounded-3xl flex flex-col transition-all hover:shadow-ambient border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant flex-shrink-0">
                         <span className="material-symbols-outlined text-sm">history</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary text-sm line-clamp-1">{b.sessionId?.title || 'Session'}</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{new Date(b.scheduledAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                      {b.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/10">
                     <Link to="/browse" className="flex-1 text-center py-2 bg-surface hover:bg-surface-container-high text-xs font-bold rounded-xl transition-colors text-primary">
                        Rebook
                     </Link>
                     {b.status === 'completed' && (
                        <button 
                          onClick={() => setReviewModal({ isOpen: true, bookingId: b._id, rating: 5, review: '' })} 
                          className="flex-1 text-center py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">star</span>
                          Review
                        </button>
                     )}
                  </div>
                  
                  {/* Review Modals Inline */}
                  {reviewModal.isOpen && reviewModal.bookingId === b._id && (
                    <div className="mt-4 p-4 bg-surface rounded-2xl border border-outline-variant/10 animate-fade-in-up">
                      <form onSubmit={handleReviewSubmit}>
                        <div className="mb-4">
                          <label className="block text-xs font-bold text-primary mb-2">Your Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setReviewModal({ ...reviewModal, rating: star })}
                                className={`p-1 transition-transform hover:scale-110 ${reviewModal.rating >= star ? 'text-amber-500' : 'text-slate-200'}`}
                              >
                                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-xs font-bold text-primary mb-2">Feedback</label>
                          <textarea
                            rows="2"
                            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline/50"
                            placeholder="Share your experience..."
                            value={reviewModal.review}
                            onChange={(e) => setReviewModal({ ...reviewModal, review: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button type="button" onClick={() => setReviewModal({ ...reviewModal, isOpen: false })} className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors">Submit</button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )) : (
                <div className="p-8 text-center text-on-surface-variant bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/30 flex flex-col items-center">
                   <p className="text-sm font-medium">No past sessions yet.</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
