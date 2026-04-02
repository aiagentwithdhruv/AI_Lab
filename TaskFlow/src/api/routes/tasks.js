const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');
const { projectAccessMiddleware } = require('../middleware/projectAccess');
const { validate, createTaskSchema, updateTaskSchema, moveTaskSchema } = require('../utils/validation');
const { notFoundError, validationError } = require('../utils/errors');

const router = express.Router({ mergeParams: true });

// All routes require auth + project access
router.use(authMiddleware, projectAccessMiddleware);

function getTaskWithJoins(db, taskId, projectId) {
  return db
    .prepare(
      `SELECT t.*,
         a.name AS assignee_name,
         c.name AS creator_name
       FROM tasks t
       LEFT JOIN users a ON a.id = t.assignee_id
       LEFT JOIN users c ON c.id = t.created_by
       WHERE t.id = ? AND t.project_id = ?`
    )
    .get(taskId, projectId);
}

// POST /api/projects/:projectId/tasks
router.post('/', validate(createTaskSchema), (req, res, next) => {
  try {
    const db = getDb();
    const projectId = req.projectId;
    const userId = req.user.id;
    const { title, description, status, priority, assignee_id, due_date } = req.validated;

    // Validate assignee is a project member
    if (assignee_id !== null && assignee_id !== undefined) {
      const member = db
        .prepare('SELECT id FROM project_members WHERE project_id = ? AND user_id = ?')
        .get(projectId, assignee_id);
      if (!member) {
        return next(validationError('Assignee must be a project member', [{ field: 'assignee_id', message: 'User is not a member of this project' }]));
      }
    }

    // Get next position in the status column
    const maxPos = db
      .prepare('SELECT COALESCE(MAX(position), -1) AS max_pos FROM tasks WHERE project_id = ? AND status = ?')
      .get(projectId, status);
    const position = maxPos.max_pos + 1;

    const result = db
      .prepare(
        `INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, due_date, position, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(projectId, title, description, status, priority, assignee_id, due_date, position, userId);

    // Log activity
    db.prepare(
      'INSERT INTO activity_log (project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(projectId, userId, 'created_task', 'task', result.lastInsertRowid, JSON.stringify({ title }));

    const task = getTaskWithJoins(db, result.lastInsertRowid, projectId);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:projectId/tasks
router.get('/', (req, res, next) => {
  try {
    const db = getDb();
    const projectId = req.projectId;
    const { status, assignee, priority, search, due_before, due_after } = req.query;

    let sql = `
      SELECT t.*,
        a.name AS assignee_name,
        c.name AS creator_name
      FROM tasks t
      LEFT JOIN users a ON a.id = t.assignee_id
      LEFT JOIN users c ON c.id = t.created_by
      WHERE t.project_id = ?
    `;
    const params = [projectId];

    if (status) {
      const statuses = status.split(',');
      sql += ` AND t.status IN (${statuses.map(() => '?').join(',')})`;
      params.push(...statuses);
    }

    if (assignee) {
      if (assignee === 'unassigned') {
        sql += ' AND t.assignee_id IS NULL';
      } else {
        sql += ' AND t.assignee_id = ?';
        params.push(parseInt(assignee, 10));
      }
    }

    if (priority) {
      const priorities = priority.split(',');
      sql += ` AND t.priority IN (${priorities.map(() => '?').join(',')})`;
      params.push(...priorities);
    }

    if (search) {
      sql += ' AND (t.title LIKE ? OR t.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (due_before) {
      sql += ' AND t.due_date <= ?';
      params.push(due_before);
    }

    if (due_after) {
      sql += ' AND t.due_date >= ?';
      params.push(due_after);
    }

    // Order by status column order, then position
    sql += `
      ORDER BY
        CASE t.status
          WHEN 'todo' THEN 1
          WHEN 'in_progress' THEN 2
          WHEN 'review' THEN 3
          WHEN 'done' THEN 4
        END,
        t.position ASC
    `;

    const tasks = db.prepare(sql).all(...params);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:projectId/tasks/:id
router.get('/:id', (req, res, next) => {
  try {
    const db = getDb();
    const taskId = parseInt(req.params.id, 10);

    const task = getTaskWithJoins(db, taskId, req.projectId);
    if (!task) {
      return next(notFoundError('Task not found'));
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
});

// PUT /api/projects/:projectId/tasks/:id
router.put('/:id', validate(updateTaskSchema), (req, res, next) => {
  try {
    const db = getDb();
    const taskId = parseInt(req.params.id, 10);
    const projectId = req.projectId;

    const existing = db.prepare('SELECT * FROM tasks WHERE id = ? AND project_id = ?').get(taskId, projectId);
    if (!existing) {
      return next(notFoundError('Task not found'));
    }

    const data = req.validated;

    // Validate assignee if provided
    if (data.assignee_id !== undefined && data.assignee_id !== null) {
      const member = db
        .prepare('SELECT id FROM project_members WHERE project_id = ? AND user_id = ?')
        .get(projectId, data.assignee_id);
      if (!member) {
        return next(validationError('Assignee must be a project member', [{ field: 'assignee_id', message: 'User is not a member of this project' }]));
      }
    }

    const updates = [];
    const params = [];
    const changes = {};

    for (const field of ['title', 'description', 'status', 'priority', 'assignee_id', 'due_date']) {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(data[field]);
        if (existing[field] !== data[field]) {
          changes[field] = { old: existing[field], new: data[field] };
        }
      }
    }

    // If status changed, move to end of new column
    if (data.status !== undefined && data.status !== existing.status) {
      const maxPos = db
        .prepare('SELECT COALESCE(MAX(position), -1) AS max_pos FROM tasks WHERE project_id = ? AND status = ?')
        .get(projectId, data.status);
      updates.push('position = ?');
      params.push(maxPos.max_pos + 1);
    }

    updates.push("updated_at = datetime('now')");
    params.push(taskId, projectId);

    db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND project_id = ?`).run(...params);

    // Log activity
    db.prepare(
      'INSERT INTO activity_log (project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(projectId, req.user.id, 'updated_task', 'task', taskId, JSON.stringify(changes));

    const task = getTaskWithJoins(db, taskId, projectId);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/projects/:projectId/tasks/:id/move
router.patch('/:id/move', validate(moveTaskSchema), (req, res, next) => {
  try {
    const db = getDb();
    const taskId = parseInt(req.params.id, 10);
    const projectId = req.projectId;
    const { status: newStatus, position: newPosition } = req.validated;

    const existing = db.prepare('SELECT * FROM tasks WHERE id = ? AND project_id = ?').get(taskId, projectId);
    if (!existing) {
      return next(notFoundError('Task not found'));
    }

    const oldStatus = existing.status;
    const oldPosition = existing.position;

    const moveTask = db.transaction(() => {
      if (newStatus !== oldStatus) {
        // Cross-column move
        // Decrement positions in source column for items after the moved task
        db.prepare(
          'UPDATE tasks SET position = position - 1 WHERE project_id = ? AND status = ? AND position > ?'
        ).run(projectId, oldStatus, oldPosition);

        // Increment positions in destination column for items at or after the target position
        db.prepare(
          'UPDATE tasks SET position = position + 1 WHERE project_id = ? AND status = ? AND position >= ?'
        ).run(projectId, newStatus, newPosition);

        // Update the task
        db.prepare(
          "UPDATE tasks SET status = ?, position = ?, updated_at = datetime('now') WHERE id = ?"
        ).run(newStatus, newPosition, taskId);

        // Log moved_task activity
        db.prepare(
          'INSERT INTO activity_log (project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(
          projectId,
          req.user.id,
          'moved_task',
          'task',
          taskId,
          JSON.stringify({ from_status: oldStatus, to_status: newStatus })
        );
      } else {
        // Within-column reorder
        if (newPosition > oldPosition) {
          // Moving down
          db.prepare(
            'UPDATE tasks SET position = position - 1 WHERE project_id = ? AND status = ? AND position > ? AND position <= ?'
          ).run(projectId, oldStatus, oldPosition, newPosition);
        } else if (newPosition < oldPosition) {
          // Moving up
          db.prepare(
            'UPDATE tasks SET position = position + 1 WHERE project_id = ? AND status = ? AND position >= ? AND position < ?'
          ).run(projectId, oldStatus, newPosition, oldPosition);
        }

        db.prepare(
          "UPDATE tasks SET position = ?, updated_at = datetime('now') WHERE id = ?"
        ).run(newPosition, taskId);
      }
    });

    moveTask();

    const task = getTaskWithJoins(db, taskId, projectId);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:projectId/tasks/:id
router.delete('/:id', (req, res, next) => {
  try {
    const db = getDb();
    const taskId = parseInt(req.params.id, 10);
    const projectId = req.projectId;

    const existing = db.prepare('SELECT * FROM tasks WHERE id = ? AND project_id = ?').get(taskId, projectId);
    if (!existing) {
      return next(notFoundError('Task not found'));
    }

    const deleteTask = db.transaction(() => {
      // Decrement positions for tasks after the deleted one in the same column
      db.prepare(
        'UPDATE tasks SET position = position - 1 WHERE project_id = ? AND status = ? AND position > ?'
      ).run(projectId, existing.status, existing.position);

      db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);

      // Log activity
      db.prepare(
        'INSERT INTO activity_log (project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(projectId, req.user.id, 'deleted_task', 'task', taskId, JSON.stringify({ title: existing.title }));
    });

    deleteTask();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
