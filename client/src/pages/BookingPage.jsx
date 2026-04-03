import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    const loadSlots = async () => {
      if (!selectedDate) return;
      try {
        const res = await bookingService.getAvailability(tutorSlug, selectedDate);
        setSlots(res.data.data);
      } catch {
        setSlots([]);
      }
    };
    loadSlots();
  }, [selectedDate, tutorSlug]);

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
      return;
    }
    if (!selectedSession || !selectedDate || !selectedSlot) {
      addToast({ type: 'warning', message: 'Please select session, date, and time slot.' });
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
              addToast({ type: 'success', message: 'Payment successful! Booking confirmed.' });
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
        addToast({ type: 'success', message: 'Booking confirmed! Check your dashboard.' });
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tutor) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Tutor not found.</div>;
  }

  // Generate next 7 days for date picker
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Tutor Header */}
        <div className="flex items-center gap-6 mb-10">
          {tutor.avatar && (
            <img src={tutor.avatar} alt={tutor.name} className="w-20 h-20 rounded-full border-4 border-white shadow-md" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{tutor.name}</h1>
            {tutor.tutorProfile?.bio && <p className="text-slate-600 mt-1">{tutor.tutorProfile.bio}</p>}
            {tutor.tutorProfile?.subjects && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {tutor.tutorProfile.subjects.map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Session picker + date + time */}
          <div className="lg:col-span-2 space-y-8">
            {/* Session type picker */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Select a Session Type</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {sessions.map((s) => (
                  <Card
                    key={s._id}
                    className={`cursor-pointer transition-all ${selectedSession?._id === s._id ? 'ring-2 ring-brand-primary shadow-md' : 'hover:shadow-sm'}`}
                    onClick={() => setSelectedSession(s)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-1">
                        <Badge variant={s.type === 'group' ? 'secondary' : 'default'}>
                          {s.type === 'group' ? <><Users size={12} className="mr-1"/>Group</> : 'One-on-One'}
                        </Badge>
                        <span className="text-sm text-slate-500 flex items-center"><Clock size={14} className="mr-1"/>{s.durationMinutes}m</span>
                      </div>
                      <CardTitle className="text-base">{s.title}</CardTitle>
                      <CardDescription className="text-brand-primary font-medium">₹{s.price}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Date picker strip */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Select a Date</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {dates.map((d) => {
                  const dayName = new Date(d).toLocaleDateString('en', { weekday: 'short' });
                  const dayNum = new Date(d).getDate();
                  return (
                    <button
                      key={d}
                      className={`flex flex-col items-center px-4 py-3 rounded-xl border min-w-[70px] transition-all ${selectedDate === d ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white hover:border-brand-primary text-slate-700'}`}
                      onClick={() => setSelectedDate(d)}
                    >
                      <span className="text-xs font-medium">{dayName}</span>
                      <span className="text-lg font-bold">{dayNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Time Slots</h2>
                {slots.length === 0 ? (
                  <p className="text-slate-500">No slots available for this date.</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {slots.map((slot) => {
                      const timeStr = new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                      const isSelected = selectedSlot?._id === slot._id;
                      const spotsLeft = slot.capacity - slot.bookedCount;
                      
                      return (
                        <button
                          key={slot._id}
                          disabled={spotsLeft <= 0}
                          className={`flex flex-col items-center px-4 py-2 rounded-lg border font-medium text-sm transition-all ${isSelected ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white hover:border-brand-primary text-slate-700'} ${spotsLeft <= 0 ? 'opacity-50 cursor-not-allowed hover:border-slate-200' : ''}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <span>{timeStr}</span>
                          <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-brand-primary-foreground/80' : 'text-slate-400'}`}>
                            {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left` : 'Full'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div className="mt-12">
                <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <Star className="text-amber-500" size={20} fill="currentColor" /> Student Reviews
                </h2>
                <div className="space-y-4">
                  {reviews.map(rev => (
                    <Card key={rev._id} className="border-slate-100">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {rev.studentId?.avatar ? (
                              <img src={rev.studentId.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                            ) : (
                              <UserCircle size={32} className="text-slate-300" />
                            )}
                            <span className="font-medium text-slate-800 text-sm">{rev.studentId?.name || 'Student'}</span>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm mt-2">{rev.review}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Session</span>
                  <span className="font-medium text-slate-900">{selectedSession ? selectedSession.title : '—'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Date</span>
                  <span className="font-medium text-slate-900">{selectedDate || '—'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Time</span>
                  <span className="font-medium text-slate-900">{selectedSlot ? new Date(selectedSlot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Price</span>
                  <span className="font-bold text-brand-primary text-lg">{selectedSession ? `₹${selectedSession.price}` : '—'}</span>
                </div>

                <hr className="my-4" />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Payment Method</label>
                  <div className="flex gap-3">
                    <button
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${paymentMethod === 'online' ? 'bg-brand-primary text-white' : 'bg-white text-slate-600'}`}
                      onClick={() => setPaymentMethod('online')}
                    >Pay Online</button>
                    <button
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${paymentMethod === 'offline' ? 'bg-brand-primary text-white' : 'bg-white text-slate-600'}`}
                      onClick={() => setPaymentMethod('offline')}
                    >Pay at Session</button>
                  </div>
                </div>

                <Button size="lg" className="w-full mt-4" disabled={booking || !selectedSession || !selectedDate || !selectedSlot} onClick={handleBook}>
                  {booking ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
