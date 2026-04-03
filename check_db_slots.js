require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const AvailabilitySlot = require('./server/src/models/AvailabilitySlot');

async function checkSlots() {
  await mongoose.connect(process.env.MONGO_URI);
  const now = new Date();
  const futureSlots = await AvailabilitySlot.find({ startTime: { $gt: now } });
  console.log('Future Slots Count:', futureSlots.length);
  if (futureSlots.length > 0) {
    futureSlots.forEach(s => {
      console.log(`- Slot ID: ${s._id}, Tutor: ${s.tutorId}, Session: ${s.sessionId}, Time: ${s.startTime}`);
    });
  } else {
    const allSlots = await AvailabilitySlot.find({});
    console.log('Total (likely past) Slots:', allSlots.length);
    if (allSlots.length > 0) {
        console.log('Sample past slot date:', allSlots[0].startTime);
    }
  }
  process.exit(0);
}

checkSlots();
