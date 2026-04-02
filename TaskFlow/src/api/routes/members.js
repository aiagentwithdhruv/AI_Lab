const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');
const { projectAccessMiddleware } = require('../middleware/projectAccess');
const { validate, inviteMemberSchema } = require('../utils/validation');
const { forbiddenError, notFoundError, conflictError, validationError } = require('../utils/errors');

const router = express.Router({ mergeParams: true });

// All routes require auth + project access
router.use(authMiddleware, projectAccessMiddleware);

// POST /api/projects/:projectId/members
router.post('/', validate(inviteMemberSchema), (req, res, next) => {
  try {
    const db = getDb();
    const projectId = req.projectId;
    const { email } = req.validated;

    // Only owner can invite
    const project = db.prepare('SELECT owner_id FROM projects WHERE id = ?').get(projectId);
    if (project.owner_id !== req.user.id) {
      return next(forbiddenError('Only the project owner can invite members'));
    }

    // Find user by email
    const invitee = db.prepare('SELECT id, name, email FROM users WHERE email = ?').get(email);
    if (!invitee) {
      return next(notFoundError('No registered user with that email'));
    }

    // Check if already a member
    const existing = db
      .prepare('SELECT id FROM project_members WHERE project_id = ? AND user_id = ?')
      .get(projectId, invitee.id);
    if (existing) {
      return next(conflictError('User is already a member of this project'));
    }

    const result = db
      .prepare('INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)')
      .run(projectId, invitee.id, 'member');

    // Log activity
    db.prepare(
      'INSERT INTO activity_log (project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(projectId, req.user.id, 'added_member', 'member', invitee.id, JSON.stringify({ email }));

    const membership = db
      .prepare(
        `SELECT pm.id, pm.project_id, pm.user_id, u.name, u.email, pm.role, pm.joined_at
         FROM project_members pm
         JOIN users u ON u.id = pm.user_id
         WHERE pm.id = ?`
      )
      .get(result.lastInsertRowid);

    res.status(201).json(membership);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:projectId/members
router.get('/', (req, res, next) => {
  try {
    const db = getDb();
    const projectId = req.projectId;

    const members = db
      .prepare(
        `SELECT pm.id, pm.user_id, u.name, u.email, pm.role, pm.joined_at
         FROM project_members pm
         JOIN users u ON u.id = pm.user_id
         WHERE pm.project_id = ?
         ORDER BY pm.joined_at ASC`
      )
      .all(projectId);

    res.json(members);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:projectId/members/:userId
router.delete('/:userId', (req, res, next) => {
  try {
    const db = getDb();
    const projectId = req.projectId;
    const targetUserId = parseInt(req.params.userId, 10);

    // Only owner can remove
    const project = db.prepare('SELECT owner_id FROM projects WHERE id = ?').get(projectId);
    if (project.owner_id !== req.user.id) {
      return next(forbiddenError('Only the project owner can remove members'));
    }

    // Can't remove self (the owner)
    if (targetUserId === req.user.id) {
      return next(validationError('Cannot remove the project owner'));
    }

    // Check membership exists
    const membership = db
      .prepare('SELECT id FROM project_members WHERE project_id = ? AND user_id = ?')
      .get(projectId, targetUserId);
    if (!membership) {
      return next(notFoundError('User is not a member of this project'));
    }

    const removeMember = db.transaction(() => {
      // Clear task assignments for this user in this project
      db.prepare('UPDATE tasks SET assignee_id = NULL WHERE project_id = ? AND assignee_id = ?').run(
        projectId,
        targetUserId
      );

      // Remove membership
      db.prepare('DELETE FROM project_members WHERE project_id = ? AND user_id = ?').run(projectId, targetUserId);

      // Log activity
      const targetUser = db.prepare('SELECT email FROM users WHERE id = ?').get(targetUserId);
      db.prepare(
        'INSERT INTO activity_log (project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(
        projectId,
        req.user.id,
        'removed_member',
        'member',
        targetUserId,
        JSON.stringify({ email: targetUser ? targetUser.email : null })
      );
    });

    removeMember();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
