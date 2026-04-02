const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');
const { projectAccessMiddleware } = require('../middleware/projectAccess');

const router = express.Router({ mergeParams: true });

router.use(authMiddleware, projectAccessMiddleware);

// GET /api/projects/:projectId/analytics
router.get('/', (req, res, next) => {
  try {
    const db = getDb();
    const projectId = req.projectId;

    // Tasks by status
    const statusRows = db
      .prepare('SELECT status, COUNT(*) AS count FROM tasks WHERE project_id = ? GROUP BY status')
      .all(projectId);
    const tasksByStatus = { todo: 0, in_progress: 0, review: 0, done: 0 };
    for (const row of statusRows) {
      tasksByStatus[row.status] = row.count;
    }

    // Tasks by assignee
    const assigneeRows = db
      .prepare(
        `SELECT t.assignee_id, COALESCE(u.name, 'Unassigned') AS assignee_name, COUNT(*) AS count
         FROM tasks t
         LEFT JOIN users u ON u.id = t.assignee_id
         WHERE t.project_id = ?
         GROUP BY t.assignee_id`
      )
      .all(projectId);
    const tasksByAssignee = assigneeRows.map((r) => ({
      assignee_id: r.assignee_id,
      assignee_name: r.assignee_name,
      count: r.count,
    }));

    // Overdue tasks
    const overdueTasks = db
      .prepare(
        `SELECT t.id, t.title, t.assignee_id, u.name AS assignee_name, t.due_date, t.status, t.priority
         FROM tasks t
         LEFT JOIN users u ON u.id = t.assignee_id
         WHERE t.project_id = ? AND t.due_date < date('now') AND t.status != 'done'
         ORDER BY t.due_date ASC`
      )
      .all(projectId);
    const overdueCount = overdueTasks.length;

    // Burndown: replay activity log to compute remaining (non-done) tasks per day
    const burndown = computeBurndown(db, projectId);

    res.json({
      tasksByStatus,
      tasksByAssignee,
      overdueCount,
      overdueTasks,
      burndown,
    });
  } catch (err) {
    next(err);
  }
});

function computeBurndown(db, projectId) {
  // Get all relevant activity events ordered by date
  const events = db
    .prepare(
      `SELECT date(created_at) AS event_date, action, details
       FROM activity_log
       WHERE project_id = ? AND entity_type = 'task'
         AND action IN ('created_task', 'moved_task', 'deleted_task')
       ORDER BY created_at ASC`
    )
    .all(projectId);

  if (events.length === 0) {
    // Fallback: just return current count
    const total = db
      .prepare("SELECT COUNT(*) AS count FROM tasks WHERE project_id = ? AND status != 'done'")
      .get(projectId).count;
    const today = new Date().toISOString().slice(0, 10);
    return [{ date: today, remaining: total }];
  }

  let remaining = 0;
  const dailyData = new Map();

  for (const event of events) {
    let details = {};
    try {
      details = JSON.parse(event.details || '{}');
    } catch (e) {
      // ignore parse errors
    }

    if (event.action === 'created_task') {
      remaining++;
    } else if (event.action === 'deleted_task') {
      remaining = Math.max(0, remaining - 1);
    } else if (event.action === 'moved_task') {
      if (details.to_status === 'done' && details.from_status !== 'done') {
        remaining = Math.max(0, remaining - 1);
      } else if (details.from_status === 'done' && details.to_status !== 'done') {
        remaining++;
      }
    }

    dailyData.set(event.event_date, remaining);
  }

  return Array.from(dailyData.entries()).map(([date, rem]) => ({
    date,
    remaining: rem,
  }));
}

module.exports = router;
