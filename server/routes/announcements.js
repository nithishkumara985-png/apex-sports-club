const express = require('express');
const db = require('../database');
const { authenticate, requireCoachOrAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  const announcements = db.prepare(`SELECT a.*, u.name as author_name FROM announcements a LEFT JOIN users u ON a.author_id = u.id ORDER BY a.pinned DESC, a.created_at DESC`).all();
  res.json(announcements);
});

router.post('/', authenticate, requireCoachOrAdmin, (req, res) => {
  const { title, content, category, pinned } = req.body;
  const result = db.prepare('INSERT INTO announcements (title, content, category, author_id, pinned) VALUES (?, ?, ?, ?, ?)').run(title, content, category || 'general', req.user.id, pinned ? 1 : 0);
  const item = db.prepare('SELECT a.*, u.name as author_name FROM announcements a LEFT JOIN users u ON a.author_id = u.id WHERE a.id = ?').get(result.lastInsertRowid);
  res.status(201).json(item);
});

module.exports = router;
