const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');
const { projectAccessMiddleware } = require('../middleware/projectAccess');
const { validate, createProjectSchema, updateProjectSchema } = require('../utils/validation');
const { forbiddenError, notFoundError } = require('../utils/errors');

const router = express.Router();

// All routes require auth
router.use(authMiddleware);

// POST /api/projects
router.post('/', validate(createProjectSchema), (req, res, next) => {
  try {
    const db = getDb();
    const { name, description } = req.validated;
    const userId = req.user.id;

    const createProject = db.transaction(() => {
      const result = db
        .prepare('INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)')
        .run(name, description, userId);

      const projectId = result.lastInsertRowid;

      db.prepare('INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)').run(
        projectId,
        userId,
        'owner'
      );

      db.prepare(
        'INSERT INTO activity_log (project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(projectId, userId, 'created_project', 'project', projectId, JSON.stringify({ name }));

      return db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    });

    const project = createProject();
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects
router.get('/', (req, res, next) => {
  try {
    const db = getDb();
    const userId = req.user.id;

    const projects = db
      .prepare(
        `SELECT p.*,
          (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) AS member_count,
          (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) AS task_count
         FROM projects p
         INNER JOIN project_members pm ON pm.project_id = p.id
         WHERE pm.user_id = ?
         ORDER BY p.updated_at DESC`
      )
      .all(userId);

    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id
router.get('/:id', projectAccessMiddleware, (req, res, next) => {
  try {
    const db = getDb();
    const projectId = req.projectId;

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);

    const members = db
      .prepare(
        `SELECT u.id, u.name, u.email, pm.role, pm.joined_at
         FROM project_members pm
         JOIN users u ON u.id = pm.user_id
         WHERE pm.project_id = ?
         ORDER BY pm.joined_at ASC`
      )
      .all(projectId);

    const statusCounts = db
      .prepare(
        `SELECT status, COUNT(*) AS count
         FROM tasks WHERE project_id = ?
         GROUP BY status`
      )
      .all(projectId);

    const task_counts = { todo: 0, in_progress: 0, review: 0, done: 0 };
    for (const row of statusCounts) {
      task_counts[row.status] = row.count;
    }

    res.json({ ...project, members, task_counts });
  } catch (err) {
    next(err);
  }
});

// PUT /api/projects/:id
router.put('/:id', projectAccessMiddleware, validate(updateProjectSchema), (req, res, next) => {
  try {
    const db = getDb();
    const projectId = req.projectId;

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);

    if (project.owner_id !== req.user.id) {
      return next(forbiddenError('Only the project owner can update the project'));
    }

    const { name, description } = req.validated;
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    updates.push("updated_at = datetime('now')");
    params.push(projectId);

    db.prepare(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    db.prepare(
      'INSERT INTO activity_log (project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(
      projectId,
      req.user.id,
      'updated_task',
      'task',
      projectId,
      JSON.stringify({ name, description })
    );

    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id
router.delete('/:id', projectAccessMiddleware, (req, res, next) => {
  try {
    const db = getDb();
    const projectId = req.projectId;

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);

    if (project.owner_id !== req.user.id) {
      return next(forbiddenError('Only the project owner can delete the project'));
    }

    db.prepare('DELETE FROM projects WHERE id = ?').run(projectId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
