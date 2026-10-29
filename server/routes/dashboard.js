const express = require('express');
const db = require('../database');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/stats', (req, res) => {
  const totalMembers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'member'").get().count;
  const totalCoaches = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'coach'").get().count;
  const activeTeams = db.prepare("SELECT COUNT(*) as count FROM teams WHERE status = 'active'").get().count;
  const upcomingEvents = db.prepare("SELECT COUNT(*) as count FROM events WHERE status = 'scheduled'").get().count;
  const pendingFees = db.prepare("SELECT SUM(amount) as total FROM fees WHERE status IN ('pending','overdue')").get().total || 0;
  const collectedFees = db.prepare("SELECT SUM(amount) as total FROM fees WHERE status = 'paid'").get().total || 0;
  const activeTournaments = db.prepare("SELECT COUNT(*) as count FROM tournaments WHERE status = 'ongoing'").get().count;

  res.json({
    totalMembers,
    totalCoaches,
    activeTeams,
    upcomingEvents,
    pendingFees,
    collectedFees,
    activeTournaments
  });
});

module.exports = router;
