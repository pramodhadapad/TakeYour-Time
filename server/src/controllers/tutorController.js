const User = require('../models/User');
const Session = require('../models/Session');

// @desc    Get all public tutors for marketplace browsing
// @route   GET /api/tutors
// @access  Public
const getPublicTutors = async (req, res, next) => {
  try {
    // Basic filtering: tutors who have completed onboarding and set profile to public
    const query = {
      role: 'tutor',
      onboarded: true,
      'tutorProfile.isPublic': true
    };

    const tutors = await User.find(query).select('name avatar tutorProfile');

    // To get locations and pricing, we optionally want to fetch their sessions 
    // and attach aggregated data.
    const enrichedTutors = await Promise.all(tutors.map(async (tutor) => {
      const sessions = await Session.find({ tutorId: tutor._id, isActive: true });
      
      // Calculate min price, available currencies, offline locations
      const prices = sessions.map(s => s.price);
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      
      // Extract unique currencies
      const currencies = [...new Set(sessions.map(s => s.currency))];
      
      // Extract unique locations from offline sessions
      const locations = [...new Set(sessions.filter(s => s.offlineAddress).map(s => s.offlineAddress))];
      
      return {
        _id: tutor._id,
        name: tutor.name,
        avatar: tutor.avatar,
        bio: tutor.tutorProfile.bio,
        subjects: tutor.tutorProfile.subjects,
        slug: tutor.tutorProfile.slug,
        sessionsCount: sessions.length,
        minPrice,
        currencies,
        locations
      };
    }));

    res.status(200).json({ success: true, count: enrichedTutors.length, data: enrichedTutors });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicTutors
};
