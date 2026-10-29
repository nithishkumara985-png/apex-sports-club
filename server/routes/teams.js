const express = require('express');
const db = require('../database');
const { authenticate, requireCoachOrAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const teams = db.prepare(`
    SELECT t.*, u.name as coach_name,
    (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.id) as member_count
    FROM teams t LEFT JOIN users u ON t.coach_id = u.id
    ORDER BY t.created_at DESC
  `).all();
  res.json(teams);
});

router.get('/:id', authenticate, (req, res) => {
  const team = db.prepare(`
    SELECT t.*, u.name as coach_name FROM teams t
    LEFT JOIN users u ON t.coach_id = u.id WHERE t.id = ?
  `).get(req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  const members = db.prepare(`
    SELECT u.id, u.name, u.email, u.sport, u.status, tm.position, tm.jersey_number, tm.joined_at
    FROM team_members tm JOIN users u ON tm.user_id = u.id WHERE tm.team_id = ?
  `).all(req.params.id);
  res.json({ ...team, members });
});

router.post('/', authenticate, requireCoachOrAdmin, (req, res) => {
  const { name, sport, coach_id, description, max_members } = req.body;
  if (!name || !sport) return res.status(400).json({ error: 'Name and sport required' });
  const result = db.prepare('INSERT INTO teams (name, sport, coach_id, description, max_members) VALUES (?, ?, ?, ?, ?)').run(name, sport, coach_id || null, description || '', max_members || 20);
  const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(team);
});

router.post('/:id/members', authenticate, requireCoachOrAdmin, (req, res) => {
  const { user_id, position, jersey_number } = req.body;
  try {
    db.prepare('INSERT INTO team_members (team_id, user_id, position, jersey_number) VALUES (?, ?, ?, ?)').run(req.params.id, user_id, position || '', jersey_number || '');
    res.status(201).json({ message: 'Member added' });
  } catch (e) {
    res.status(409).json({ error: 'Member already in team' });
  }
});

router.delete('/:id/members/:userId', authenticate, requireCoachOrAdmin, (req, res) => {
  db.prepare('DELETE FROM team_members WHERE team_id = ? AND user_id = ?').run(req.params.id, req.params.userId);
  res.json({ message: 'Member removed' });
});

module.exports = router;
