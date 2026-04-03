const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  role: { type: String, enum: ['tutor', 'student', 'admin', null], default: null },
  onboarded: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  googleAccessToken: { type: String },
  googleRefreshToken: { type: String },
  tutorProfile: {
    slug: { type: String, unique: true, sparse: true },
    bio: { type: String },
    subjects: [{ type: String }],
    cancellationHours: { type: Number, default: 24 },
    isPublic: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
