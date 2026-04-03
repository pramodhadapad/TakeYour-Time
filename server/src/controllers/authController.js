const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

const googleCallback = (req, res) => {
  const user = req.user;
  const token = generateJWT(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Flag if this is a brand new user who hasn't picked a role yet
  const isNew = !user.onboarded;

  res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?token=${token}&refresh=${refreshToken}&new=${isNew}`);
};

const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const selectRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['tutor', 'student'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role. Must be "tutor" or "student".' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    user.role = role;
    user.onboarded = true;

    // If they chose tutor, set up a default tutor profile with a slug
    if (role === 'tutor') {
      const baseSlug = user.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      // Make slug unique by appending a short random string
      const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
      user.tutorProfile = {
        slug: uniqueSlug,
        bio: '',
        subjects: [],
        cancellationHours: 24,
        isPublic: true
      };
    }

    await user.save();

    console.log(`[Auth] User ${user.email} selected role: ${role}`);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.status(200).json({ success: true, data: {} });
};

module.exports = {
  googleCallback,
  getMe,
  selectRole,
  logout
};
