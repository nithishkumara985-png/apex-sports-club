const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'sports_club_secret_key_2024';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};

const requireCoachOrAdmin = (req, res, next) => {
  if (!['admin', 'coach'].includes(req.user.role)) return res.status(403).json({ error: 'Coach or Admin access required' });
  next();
};

module.exports = { authenticate, requireAdmin, requireCoachOrAdmin, JWT_SECRET };

