const express = require('express');
const db = require('../database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, requireAdmin, (req, res) => {
  const { user_id, status } = req.query;
  let query = `SELECT f.*, u.name as user_name, u.email FROM fees f JOIN users u ON f.user_id = u.id WHERE 1=1`;
  const params = [];
  if (user_id) { query += ' AND f.user_id = ?'; params.push(user_id); }
  if (status) { query += ' AND f.status = ?'; params.push(status); }
  query += ' ORDER BY f.due_date DESC';
  res.json(db.prepare(query).all(...params));
});

router.post('/', authenticate, requireAdmin, (req, res) => {
  const { user_id, amount, type, description, due_date } = req.body;
  if (!user_id || !amount || !type || !due_date) return res.status(400).json({ error: 'Required fields missing' });
  const result = db.prepare('INSERT INTO fees (user_id, amount, type, description, due_date) VALUES (?, ?, ?, ?, ?)').run(user_id, amount, type, description || '', due_date);
  const fee = db.prepare('SELECT f.*, u.name as user_name FROM fees f JOIN users u ON f.user_id = u.id WHERE f.id = ?').get(result.lastInsertRowid);
  res.status(201).json(fee);
});

router.put('/:id/pay', authenticate, requireAdmin, (req, res) => {
  const { payment_method } = req.body;
  const today = new Date().toISOString().split('T')[0];
  db.prepare('UPDATE fees SET status=?, paid_date=?, payment_method=? WHERE id=?').run('paid', today, payment_method || 'Credit Card', req.params.id);
  const fee = db.prepare('SELECT * FROM fees WHERE id = ?').get(req.params.id);
  res.json(fee);
});

module.exports = router;
