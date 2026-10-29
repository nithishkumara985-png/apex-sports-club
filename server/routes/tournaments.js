const express = require('express');
const db = require('../database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const tournaments = db.prepare(`SELECT * FROM tournaments ORDER BY start_date DESC`).all();
  res.json(tournaments);
});

router.get('/:id', authenticate, (req, res) => {
  const tournament = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(req.params.id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
  const matches = db.prepare('SELECT * FROM tournament_matches WHERE tournament_id = ? ORDER BY round, match_number').all(req.params.id);
  res.json({ ...tournament, matches });
});

router.post('/', authenticate, requireAdmin, (req, res) => {
  const { name, sport, format, description, start_date, end_date, venue, max_teams, prize } = req.body;
  const result = db.prepare('INSERT INTO tournaments (name, sport, format, description, start_date, end_date, venue, max_teams, prize) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(name, sport, format || 'knockout', description || '', start_date, end_date, venue || '', max_teams || 8, prize || '');
  const tournament = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(tournament);
});

module.exports = router;
