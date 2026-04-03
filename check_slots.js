require('dotenv').config();
const mongoose = require('mongoose');
const AvailabilitySlot = require('./server/src/models/AvailabilitySlot');

async function checkSlots() {
  await mongoose.connect(process.env.MONGODB_URI);
  const slots = await AvailabilitySlot.find({});
  console.log('Total Slots:', slots.length);
  slots.forEach(s => {
    console.log(`Tutor: ${s.tutorId}, Date: ${s.startTime}, Booked: ${s.bookedCount}/${s.capacity}`);
  });
  process.exit(0);
}

checkSlots();
