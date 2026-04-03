const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('[Passport] Google auth callback for:', profile.displayName);
      let user = await User.findOne({ googleId: profile.id });
      const adminEmail = process.env.ADMIN_EMAIL;

      if (!user) {
        const isAdmin = adminEmail && profile.emails[0].value === adminEmail;
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
          role: isAdmin ? 'admin' : null,
          onboarded: isAdmin ? true : false,
          googleAccessToken: accessToken,
          googleRefreshToken: refreshToken
        });
        console.log('[Passport] New user created:', user.email, isAdmin ? '(ADMIN)' : '');
      } else {
        user.googleAccessToken = accessToken;
        if (refreshToken) {
          user.googleRefreshToken = refreshToken;
        }
        // Auto-promote to admin if email matches
        if (adminEmail && user.email === adminEmail && user.role !== 'admin') {
          user.role = 'admin';
          user.onboarded = true;
          console.log('[Passport] User promoted to ADMIN:', user.email);
        }
        await user.save();
        console.log('[Passport] Existing user updated:', user.email);
      }
      return done(null, user);
    } catch (err) {
      console.error('[Passport] Auth error:', err.message);
      return done(err, null);
    }
  }));
  console.log('[Passport] Google OAuth strategy initialized.');
} else {
  console.warn('WARN: Google OAuth credentials missing. Passport strategy not initialized.');
}

module.exports = passport;
