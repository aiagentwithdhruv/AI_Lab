const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db/database');
const { signToken } = require('../middleware/auth');
const { validate, signupSchema, loginSchema } = require('../utils/validation');
const { conflictError, unauthorizedError } = require('../utils/errors');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', validate(signupSchema), (req, res, next) => {
  try {
    const db = getDb();
    const { name, email, password } = req.validated;

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return next(conflictError('Email already registered'));
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const result = db
      .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
      .run(name, email, passwordHash);

    const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = signToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), (req, res, next) => {
  try {
    const db = getDb();
    const { email, password } = req.validated;

    const user = db.prepare('SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?').get(email);
    if (!user) {
      return next(unauthorizedError('Invalid email or password'));
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return next(unauthorizedError('Invalid email or password'));
    }

    const { password_hash, ...safeUser } = user;
    const token = signToken(safeUser);

    res.json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
