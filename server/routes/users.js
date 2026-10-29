const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all users
router.get('/', authenticate, (req, res) => {
  const { role, status, sport, search } = req.query;
  let query = 'SELECT id, name, email, role, sport, phone, address, join_date, status, avatar, created_at FROM users WHERE 1=1';
  const params = [];
  if (role) { query += ' AND role = ?'; params.push(role); }
  if (status) { query += ' AND status = ?'; params.push(status); }
  if (sport) { query += ' AND sport = ?'; params.push(sport); }
  if (search) { query += ' AND (name LIKE ? OR email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  query += ' ORDER BY created_at DESC';
  res.json(db.prepare(query).all(...params));
});

// Get user by ID
router.get('/:id', authenticate, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, sport, phone, address, date_of_birth, join_date, status, avatar, created_at FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Update user (admin only)
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const { name, email, role, sport, phone, address, status } = req.body;
  db.prepare('UPDATE users SET name=?, email=?, role=?, sport=?, phone=?, address=?, status=? WHERE id=?')
    .run(name, email, role, sport, phone, address, status, req.params.id);
  const user = db.prepare('SELECT id, name, email, role, sport, phone, address, join_date, status FROM users WHERE id = ?').get(req.params.id);
  res.json(user);
});

// Delete user (admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;
