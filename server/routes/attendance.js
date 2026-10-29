const express = require('express');
const db = require('../database');
const { authenticate, requireCoachOrAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/event/:eventId', authenticate, (req, res) => {
  const records = db.prepare(`
    SELECT a.*, u.name as user_name, u.email, u.sport
    FROM attendance a JOIN users u ON a.user_id = u.id
    WHERE a.event_id = ? ORDER BY u.name
  `).all(req.params.eventId);
  res.json(records);
});

router.post('/', authenticate, requireCoachOrAdmin, (req, res) => {
  const { event_id, user_id, status, notes } = req.body;
  if (!event_id || !user_id || !status) return res.status(400).json({ error: 'event_id, user_id and status required' });
  db.prepare('INSERT INTO attendance (event_id, user_id, status, notes) VALUES (?, ?, ?, ?) ON CONFLICT(event_id, user_id) DO UPDATE SET status=excluded.status, notes=excluded.notes, marked_at=CURRENT_TIMESTAMP')
    .run(event_id, user_id, status, notes || '');
  const record = db.prepare('SELECT * FROM attendance WHERE event_id = ? AND user_id = ?').get(event_id, user_id);
  res.json(record);
});

module.exports = router;
