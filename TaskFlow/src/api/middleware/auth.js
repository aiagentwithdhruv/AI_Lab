const jwt = require('jsonwebtoken');
const { unauthorizedError } = require('../utils/errors');

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow-dev-secret-change-in-production';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(unauthorizedError('Missing or invalid Authorization header'));
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    return next(unauthorizedError('Invalid or expired token'));
  }
}

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

module.exports = { authMiddleware, signToken, JWT_SECRET };
