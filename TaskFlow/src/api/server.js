const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { runMigrations } = require('./db/migrations');
const { seedDatabase } = require('./db/seed');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const memberRoutes = require('./routes/members');
const activityRoutes = require('./routes/activity');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/tasks', taskRoutes);
app.use('/api/projects/:projectId/members', memberRoutes);
app.use('/api/projects/:projectId/activity', activityRoutes);
app.use('/api/projects/:projectId/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';
  const details = err.details || [];

  if (statusCode === 500) {
    console.error('Unhandled error:', err);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      details,
    },
  });
});

// Initialize database
try {
  runMigrations();
  seedDatabase();
} catch (err) {
  console.error('Failed to initialize database:', err);
  process.exit(1);
}

// Only start the HTTP server when run directly, not when imported by tests.
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`TaskFlow API server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
