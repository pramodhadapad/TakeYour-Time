const express = require('express');
const { createSlot, getSessionSlots, getTutorSlots, deleteSlot } = require('../controllers/slotController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/session/:sessionId', getSessionSlots);
router.get('/tutor/me', requireAuth, getTutorSlots);
router.post('/', requireAuth, createSlot);
router.delete('/:id', requireAuth, deleteSlot);

module.exports = router;
