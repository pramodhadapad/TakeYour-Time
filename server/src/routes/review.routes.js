const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const { requireStudent } = require('../middlewares/roleMiddleware');
const { submitReview, getTutorReviews } = require('../controllers/reviewController');

const router = express.Router();

router.post('/', requireAuth, requireStudent, submitReview);
router.get('/public/:slug', getTutorReviews); // Public

module.exports = router;
