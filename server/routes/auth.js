const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { JWT_SECRET, authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid credentials' });
  if (user.status !== 'active') return res.status(403).json({ error: 'Account suspended or inactive' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...userSafe } = user;
  res.json({ token, user: userSafe });
});

router.post('/register', (req, res) => {
  const { name, email, password, sport, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) return res.status(409).json({ error: 'Email already registered' });
  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (name,email,password,sport,phone) VALUES (?,?,?,?,?)').run(name, email, hash, sport || '', phone || '');
  const user = db.prepare('SELECT id,name,email,role,sport,phone,status,join_date FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user });
});

router.get('/me', authenticate, (req, res) => {
  const user = db.prepare('SELECT id,name,email,role,sport,phone,address,date_of_birth,join_date,status,avatar,created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.put('/profile', authenticate, (req, res) => {
  const { name, sport, phone, address, date_of_birth } = req.body;
  db.prepare('UPDATE users SET name=?,sport=?,phone=?,address=?,date_of_birth=? WHERE id=?').run(name, sport, phone, address, date_of_birth, req.user.id);
  const user = db.prepare('SELECT id,name,email,role,sport,phone,address,date_of_birth,join_date,status FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

module.exports = router;

