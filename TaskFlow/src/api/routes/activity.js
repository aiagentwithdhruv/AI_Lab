const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');
const { projectAccessMiddleware } = require('../middleware/projectAccess');

const router = express.Router({ mergeParams: true });

router.use(authMiddleware, projectAccessMiddleware);

// GET /api/projects/:projectId/activity
router.get('/', (req, res, next) => {
  try {
    const db = getDb();
    const projectId = req.projectId;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = parseInt(req.query.offset, 10) || 0;

    const total = db
      .prepare('SELECT COUNT(*) AS count FROM activity_log WHERE project_id = ?')
      .get(projectId).count;

    const activities = db
      .prepare(
        `SELECT al.*,
           u.name AS user_name,
           CASE al.entity_type
             WHEN 'task' THEN (SELECT title FROM tasks WHERE id = al.entity_id)
             WHEN 'member' THEN (SELECT name FROM users WHERE id = al.entity_id)
           END AS entity_name
         FROM activity_log al
         JOIN users u ON u.id = al.user_id
         WHERE al.project_id = ?
         ORDER BY al.created_at DESC
         LIMIT ? OFFSET ?`
      )
      .all(projectId, limit, offset);

    // Parse details JSON
    const parsed = activities.map((a) => ({
      ...a,
      details: typeof a.details === 'string' ? JSON.parse(a.details) : a.details,
    }));

    res.json({
      activities: parsed,
      total,
      limit,
      offset,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
