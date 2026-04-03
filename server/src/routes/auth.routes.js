const express = require('express');
const passport = require('passport');
const { googleCallback, getMe, selectRole, logout } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/google', passport.authenticate('google', {
  session: false,
  scope: ['profile', 'email'],
  accessType: 'offline',
  prompt: 'consent'
}));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/login?error=auth_failed` : '/login?error=auth_failed'
  }),
  googleCallback
);

router.get('/me', requireAuth, getMe);
router.patch('/role', requireAuth, selectRole);
router.post('/logout', requireAuth, logout);

module.exports = router;
