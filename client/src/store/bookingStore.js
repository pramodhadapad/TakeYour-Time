import { create } from 'zustand';

const useBookingStore = create((set) => ({
  selectedSession: null,
  selectedDate: null,
  selectedSlot: null,
  paymentMethod: 'online',

  setSelectedSession: (session) => set({ selectedSession: session }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  reset: () => set({
    selectedSession: null,
    selectedDate: null,
    selectedSlot: null,
    paymentMethod: 'online'
  })
}));

export default useBookingStore;
