import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import reviewService from '../services/reviewService';
import useBookingStore from '../store/bookingStore';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Star, Clock, MapPin, Video, Users, UserCircle } from 'lucide-react';

export default function BookingPage() {
  const { tutorSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useNotificationStore();
  const { selectedSession, selectedDate, selectedSlot, paymentMethod, setSelectedSession, setSelectedDate, setSelectedSlot, setPaymentMethod, reset } = useBookingStore();

  const [tutor, setTutor] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [tutorRes, sessionsRes, reviewsRes] = await Promise.all([
          bookingService.getTutor(tutorSlug),
          bookingService.getTutorSessions(tutorSlug),
          reviewService.getTutorReviews(tutorSlug).catch(() => ({ data: { data: [] } }))
        ]);
        setTutor(tutorRes.data.data);
        setSessions(sessionsRes.data.data);
        setReviews(reviewsRes.data.data);
      } catch {
        addToast({ type: 'error', message: 'Failed to load tutor profile.' });
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => reset();
  }, [tutorSlug]);

  useEffect(() => {
    if (sessions.length === 1 && !selectedSession) {
      setSelectedSession(sessions[0]);
    }
  }, [sessions, selectedSession, setSelectedSession]);

  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedDate) return;
      try {
        const res = await bookingService.getAvailability(tutorSlug, selectedDate, selectedSession?._id);
        setSlots(res.data.data);
      } catch {
        setSlots([]);
      }
    };
    loadSlots();
  }, [selectedDate, tutorSlug, selectedSession]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBook = async () => {
    if (!user) {
      addToast({ type: 'warning', message: 'Please log in to book a session.' });
      navigate(`/login?from=/book/${tutorSlug}`);
      return;
    }
    if (!selectedSession || !selectedDate || !selectedSlot) {
      addToast({ type: 'warning', message: 'Please select a session, date, and time slot first.' });
      return;
    }

    setBooking(true);
    try {
      const res = await bookingService.createBooking(tutorSlug, {
        sessionId: selectedSession._id,
        slotId: selectedSlot._id,
        paymentMethod
      });
      
      const { booking: createdBooking, razorpayOrder } = res.data.data;

      if (paymentMethod === 'online' && razorpayOrder) {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          addToast({ type: 'error', message: 'Failed to load payment gateway. Please check your internet.' });
          setBooking(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock',
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Take Your Time',
          description: `Booking for ${selectedSession.title}`,
          order_id: razorpayOrder.id,
          handler: async function (response) {
            try {
              await bookingService.verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: createdBooking._id
              });
              addToast({ type: 'success', message: 'Payment successful! Slot confirmed.' });
              reset();
            } catch (err) {
              addToast({ type: 'error', message: err.response?.data?.error || 'Payment verification failed.' });
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#2563eb'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          addToast({ type: 'error', message: 'Payment failed. Please try again.' });
        });
        rzp.open();
      } else {
        addToast({ type: 'success', message: 'Slot confirmed! Check your dashboard.' });
        reset();
      }
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Booking failed.' });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tutor) {
    return <div className="min-h-screen flex items-center justify-center text-on-surface-variant font-body bg-surface">Tutor not found.</div>;
  }

  // Generate next 7 days for date picker
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased selection:bg-primary-container selection:text-white">
      <Navbar />
      
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Profile & Scheduling */}
        <div className="lg:col-span-8 space-y-12">
          {/* Elegant Profile Header */}
          <section className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden rotate-3 shadow-xl">
                {tutor.avatar ? (
                  <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover -rotate-3 scale-110" />
                ) : (
                  <div className="w-full h-full bg-surface-container flex items-center justify-center text-primary -rotate-3 scale-110">
                    <UserCircle size={64} />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-on-primary-container text-white p-1.5 rounded-full shadow-lg border-4 border-surface">
                <span className="material-symbols-outlined text-sm block" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-headline font-bold tracking-tight text-primary">{tutor.name}</h1>
              </div>
              {tutor.tutorProfile?.bio && (
                  <p className="text-on-surface-variant max-w-lg leading-relaxed">{tutor.tutorProfile.bio}</p>
              )}
              {tutor.tutorProfile?.subjects && (
                <div className="flex gap-2 flex-wrap pt-2">
                  {tutor.tutorProfile.subjects.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-xs font-bold rounded-full tracking-wider uppercase">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Session Selection */}
          <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-headline font-semibold text-primary mb-6">Select a Session Type</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {sessions.map((s) => (
                <div 
                  key={s._id}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedSession?._id === s._id 
                      ? 'border-primary bg-primary/5 shadow-md relative' 
                      : 'border-outline-variant/30 hover:border-primary/50 bg-white hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedSession(s)}
                >
                  {selectedSession?._id === s._id && (
                    <div className="absolute top-4 right-4 text-primary">
                      <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                     <span className="px-2 py-1 bg-surface-container-high rounded text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                       {s.type === 'group' ? <Users size={12}/> : null} {s.type === 'group' ? 'Group' : 'One-on-One'}
                     </span>
                     <span className="text-xs text-on-surface-variant flex items-center"><Clock size={12} className="mr-1"/>{s.durationMinutes}m</span>
                  </div>
                  <h3 className="font-headline font-semibold text-lg mb-1">{s.title}</h3>
                  <p className="text-primary font-bold">₹{s.price}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sophisticated Calendar Interaction */}
          <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-headline font-semibold text-primary">Select your date & time</h2>
            </div>
            
            <div className="space-y-8">
              {/* Date strip */}
              <div className="flex gap-4 overflow-x-auto pb-4" style={{scrollbarWidth: 'none'}}>
                {dates.map((d) => {
                  const dayName = new Date(d).toLocaleDateString('en', { weekday: 'short' });
                  const dayNum = new Date(d).getDate();
                  const isSelected = selectedDate === d;
                  return (
                    <button
                      key={d}
                      className={`group flex-shrink-0 flex flex-col items-center p-4 rounded-2xl min-w-[4.5rem] transition-all ${
                        isSelected 
                          ? 'bg-primary text-white shadow-xl scale-105' 
                          : 'bg-surface hover:bg-surface-container-high'
                      }`}
                      onClick={() => setSelectedDate(d)}
                    >
                      <span className="text-xs uppercase tracking-widest opacity-80 mb-1">{dayName}</span>
                      <span className={`text-xl ${isSelected ? 'font-bold' : 'font-medium'}`}>{dayNum}</span>
                      <span className={`w-1.5 h-1.5 rounded-full mt-2 transition-all ${
                        isSelected ? 'bg-white' : 'bg-primary-container opacity-0 group-hover:opacity-100'
                      }`}></span>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="pt-8 border-t border-outline-variant/20">
                  <h3 className="text-sm font-bold text-outline uppercase tracking-widest mb-6">Available Times</h3>
                  {slots.length === 0 ? (
                    <p className="text-on-surface-variant font-medium">No slots available for this date.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {slots.map((slot) => {
                        const timeStr = new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                        const isSelected = selectedSlot?._id === slot._id;
                        const spotsLeft = slot.capacity - slot.bookedCount;
                        return (
                          <button
                            key={slot._id}
                            disabled={spotsLeft <= 0}
                            className={`py-3 px-2 rounded-xl transition-all text-center text-sm flex flex-col items-center justify-center
                              ${isSelected ? 'bg-on-primary-container text-white shadow-md font-bold' : 'border border-outline-variant hover:border-primary hover:text-primary font-medium'}
                              ${spotsLeft <= 0 ? 'opacity-50 cursor-not-allowed hover:border-outline-variant hover:text-on-surface' : ''}
                            `}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            <span>{timeStr}</span>
                            <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80 font-normal' : 'text-outline'}`}>
                              {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left` : 'Full'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-headline font-semibold text-primary mb-6 flex items-center gap-3">
                 <span className="material-symbols-outlined text-amber-500" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                 Student Reviews
              </h2>
              <div className="space-y-4">
                {reviews.map(rev => (
                  <div key={rev._id} className="p-6 rounded-2xl bg-surface border border-outline-variant/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {rev.studentId?.avatar ? (
                          <img src={rev.studentId.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {(rev.studentId?.name || 'S')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-primary text-sm">{rev.studentId?.name || 'Student'}</p>
                          <div className="flex text-amber-400 mt-0.5">
                            {[...Array(rev.rating)].map((_, i) => <span key={i} className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-on-surface-variant text-sm italic">"{rev.review}"</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Right Column: Booking Summary Sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
          <div className="glass-card rounded-[2rem] p-8 border border-white/40 shadow-2xl shadow-indigo-500/5 space-y-8 relative overflow-hidden bg-white/70 backdrop-blur-xl">
            {/* Abstract Accent Background */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl -z-10"></div>
            
            <div>
              <h3 className="text-2xl font-headline font-bold text-primary mb-1">Booking Summary</h3>
              <p className="text-on-surface-variant text-sm">Review your selected session details.</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/5 p-2 rounded-xl text-primary">
                  <span className="material-symbols-outlined">class</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-tight">Session</p>
                  <p className="text-on-surface font-semibold">{selectedSession ? selectedSession.title : '—'}</p>
                  {selectedSession && <p className="text-on-surface-variant text-sm">{selectedSession.durationMinutes} minutes</p>}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/5 p-2 rounded-xl text-primary">
                  <span className="material-symbols-outlined">event</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-tight">Date & Time</p>
                  <p className="text-on-surface font-semibold">
                    {selectedDate ? new Date(selectedDate).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' }) : '—'}
                  </p>
                  <p className="text-on-surface-variant text-sm">
                    {selectedSlot ? new Date(selectedSlot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/5 p-2 rounded-xl text-primary">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-tight">Investment</p>
                  <p className="text-on-surface font-semibold text-lg">
                    {selectedSession ? `₹${selectedSession.price}` : '—'}
                  </p>
                </div>
              </div>

              {/* Payment Method UI */}
              <div className="pt-2">
                <p className="text-xs font-bold text-outline uppercase tracking-tight mb-3">Payment Method</p>
                <div className="flex gap-2">
                  <button
                    className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${paymentMethod === 'online' ? 'bg-primary-container text-white border-primary-container shadow-md' : 'bg-white text-on-surface-variant border-outline-variant/30 hover:border-primary/30'}`}
                    onClick={() => setPaymentMethod('online')}
                  >Pay Online</button>
                  <button
                    className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${paymentMethod === 'offline' ? 'bg-primary-container text-white border-primary-container shadow-md' : 'bg-white text-on-surface-variant border-outline-variant/30 hover:border-primary/30'}`}
                    onClick={() => setPaymentMethod('offline')}
                  >Pay at Session</button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-outline-variant/30">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-headline font-bold">Total</span>
                <span className="text-2xl font-headline font-bold text-primary">
                  {selectedSession ? `₹${selectedSession.price}` : '₹0'}
                </span>
              </div>
              
              <button 
                className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                disabled={booking}
                onClick={handleBook}
              >
                <span>{booking ? 'Confirming...' : 'Confirm Reservation'}</span>
                {!booking && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
              </button>
              <p className="text-center text-[10px] text-outline mt-6 uppercase tracking-widest font-semibold text-opacity-70">
                Secure encrypted checkout by Take Your Time
              </p>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
