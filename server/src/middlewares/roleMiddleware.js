const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ success: false, error: `Forbidden: Requires ${role} role` });
    }
  };
};

const requireTutor = requireRole('tutor');
const requireStudent = requireRole('student');
const requireAdmin = requireRole('admin');

module.exports = { requireTutor, requireStudent, requireAdmin };
