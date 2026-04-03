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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header with gradient */}
      <div className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563EB 50%, #3b82f6 100%)',
        padding: '48px 0 64px',
      }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
        </div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in-up">Student Dashboard</h1>
          <p className="text-white/60 animate-fade-in-up delay-100">Track your sessions and manage bookings</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 pb-12">

        {/* Stats Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Upcoming Sessions', value: upcoming.length, icon: <Calendar size={20} />, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Past Sessions', value: past.length, icon: <History size={20} />, color: 'text-slate-700', bg: 'bg-slate-100' },
            { label: 'Total Bookings', value: upcoming.length + past.length, icon: <TrendingUp size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          ].map((stat, i) => (
            <Card key={i} className="animate-fade-in-up border-0 shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming */}
        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-brand-primary" />
          Upcoming Sessions
        </h2>
        {upcoming.length === 0 ? (
          <Card className="mb-10 border-dashed border-2 border-slate-200">
            <CardContent className="py-12 text-center">
              <div className="text-5xl mb-4">📚</div>
              <p className="text-slate-500 mb-2">No upcoming sessions scheduled.</p>
              <Link to="/browse" className="text-brand-primary font-semibold hover:underline inline-flex items-center gap-1">
                Browse available sessions →
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 mb-10">
            {upcoming.map((b) => (
              <Card key={b._id} className="hover:shadow-md transition-all duration-300 border-slate-200/80 hover:border-brand-primary/20">
                <CardContent className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-slate-900">{b.sessionId?.title || 'Session'}</h3>
                      <Badge variant={statusColors[b.status]}>{b.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(b.scheduledAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock size={14}/> {new Date(b.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="destructive" size="sm" onClick={() => handleCancel(b._id)}>
                      <X size={14} className="mr-1"/> Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Past */}
        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <History size={20} className="text-slate-400" />
          Past Sessions
        </h2>
        {past.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200">
            <CardContent className="py-12 text-center">
              <div className="text-5xl mb-4">🕐</div>
              <p className="text-slate-500">No past sessions yet. Book your first one!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {past.map((b) => (
              <Card key={b._id} className="border-slate-200/80">
                <CardContent className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-slate-900">{b.sessionId?.title || 'Session'}</h3>
                      <Badge variant={statusColors[b.status]}>{b.status}</Badge>
                    </div>
                    <div className="text-sm text-slate-500">
                      {new Date(b.scheduledAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link to="/browse">
                      <Button variant="outline" size="sm" className="w-full">
                        <RotateCcw size={14} className="mr-1"/> Rebook
                      </Button>
                    </Link>
                    {b.status === 'completed' && (
                      <Button variant="default" size="sm" className="bg-amber-500 hover:bg-amber-600 w-full" onClick={() => setReviewModal({ isOpen: true, bookingId: b._id, rating: 5, review: '' })}>
                        <Star size={14} className="mr-1"/> Leave Review
                      </Button>
                    )}
                  </div>
                </CardContent>
                
                {/* Review Form Expansion */}
                {reviewModal.isOpen && reviewModal.bookingId === b._id && (
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <form onSubmit={handleReviewSubmit}>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewModal({ ...reviewModal, rating: star })}
                              className={`p-1 ${reviewModal.rating >= star ? 'text-amber-400' : 'text-slate-300'}`}
                            >
                              <Star size={24} fill={reviewModal.rating >= star ? 'currentColor' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Review</label>
                        <textarea
                          rows="3"
                          className="w-full border rounded-md px-3 py-2 text-sm"
                          placeholder="How was your session?"
                          value={reviewModal.review}
                          onChange={(e) => setReviewModal({ ...reviewModal, review: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" size="sm" onClick={() => setReviewModal({ ...reviewModal, isOpen: false })}>Cancel</Button>
                        <Button type="submit" size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">Submit Review</Button>
                      </div>
                    </form>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
