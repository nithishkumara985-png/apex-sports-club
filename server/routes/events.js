const express = require('express');
const db = require('../database');
const { authenticate, requireCoachOrAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const { type, sport, status } = req.query;
  let query = `SELECT e.*, t.name as team_name, u.name as created_by_name 
    FROM events e LEFT JOIN teams t ON e.team_id = t.id LEFT JOIN users u ON e.created_by = u.id WHERE 1=1`;
  const params = [];
  if (type) { query += ' AND e.type = ?'; params.push(type); }
  if (sport) { query += ' AND e.sport = ?'; params.push(sport); }
  if (status) { query += ' AND e.status = ?'; params.push(status); }
  query += ' ORDER BY e.start_datetime ASC';
  res.json(db.prepare(query).all(...params));
});

router.post('/', authenticate, requireCoachOrAdmin, (req, res) => {
  const { title, type, sport, description, venue, start_datetime, end_datetime, team_id, opponent } = req.body;
  if (!title || !type || !start_datetime || !end_datetime) return res.status(400).json({ error: 'Required fields missing' });
  const result = db.prepare('INSERT INTO events (title, type, sport, description, venue, start_datetime, end_datetime, team_id, opponent, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(title, type, sport || '', description || '', venue || '', start_datetime, end_datetime, team_id || null, opponent || '', req.user.id);
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(event);
});

router.put('/:id', authenticate, requireCoachOrAdmin, (req, res) => {
  const { title, type, sport, description, venue, start_datetime, end_datetime, team_id, opponent, status, score } = req.body;
  db.prepare('UPDATE events SET title=?, type=?, sport=?, description=?, venue=?, start_datetime=?, end_datetime=?, team_id=?, opponent=?, status=?, score=? WHERE id=?')
    .run(title, type, sport, description, venue, start_datetime, end_datetime, team_id || null, opponent, status, score, req.params.id);
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  res.json(event);
});

module.exports = router;
