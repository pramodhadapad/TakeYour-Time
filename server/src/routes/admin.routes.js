const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/roleMiddleware');
const { getDashboardMetrics, getAllUsers, toggleBanUser } = require('../controllers/adminController');

// All admin routes are strictly protected
router.use(requireAuth, requireAdmin);

router.get('/metrics', getDashboardMetrics);
router.get('/users', getAllUsers);
router.patch('/users/:id/ban', toggleBanUser);

module.exports = router;
