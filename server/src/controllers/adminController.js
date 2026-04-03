const User = require('../models/User');
const Booking = require('../models/Booking');
const Session = require('../models/Session');
const Payment = require('../models/Payment');

// GET /api/admin/metrics — Platform health dashboard
const getDashboardMetrics = async (req, res) => {
  try {
    const [totalUsers, totalTutors, totalStudents, totalBookings, totalSessions] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'tutor' }),
      User.countDocuments({ role: 'student' }),
      Booking.countDocuments(),
      Session.countDocuments()
    ]);

    // Revenue: sum of all paid payments
    const revenueAgg = await Payment.aggregate([
      { $match: { status: 'captured' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Recent bookings (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentBookings = await Booking.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Booking status breakdown
    const statusBreakdown = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      metrics: {
        totalUsers,
        totalTutors,
        totalStudents,
        totalBookings,
        totalSessions,
        totalRevenue,
        recentBookings,
        statusBreakdown: statusBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (err) {
    console.error('[Admin] getDashboardMetrics error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch metrics' });
  }
};

// GET /api/admin/users — Paginated user list with search
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const roleFilter = req.query.role || '';

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (roleFilter) {
      query.role = roleFilter;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('name email role avatar onboarded createdAt')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('[Admin] getAllUsers error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
};

// PATCH /api/admin/users/:id/ban — Ban/unban a user
const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    // Toggle the banned flag
    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ success: true, user: { _id: user._id, name: user.name, isBanned: user.isBanned } });
  } catch (err) {
    console.error('[Admin] toggleBanUser error:', err);
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
};

module.exports = { getDashboardMetrics, getAllUsers, toggleBanUser };
