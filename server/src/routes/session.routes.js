const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const { requireTutor } = require('../middlewares/roleMiddleware');
const {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  getAvailability,
  updateAvailability,
  updateTutorProfile
} = require('../controllers/sessionController');

const router = express.Router();

// All tutor-only
router.get('/sessions', requireAuth, requireTutor, getSessions);
router.post('/sessions', requireAuth, requireTutor, createSession);
router.put('/sessions/:id', requireAuth, requireTutor, updateSession);
router.delete('/sessions/:id', requireAuth, requireTutor, deleteSession);
router.get('/availability', requireAuth, requireTutor, getAvailability);
router.put('/availability', requireAuth, requireTutor, updateAvailability);
router.put('/profile', requireAuth, requireTutor, updateTutorProfile);

module.exports = router;
