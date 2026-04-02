const { getDb } = require('../db/database');
const { forbiddenError, notFoundError } = require('../utils/errors');

function projectAccessMiddleware(req, res, next) {
  const db = getDb();
  const projectId = parseInt(req.params.projectId || req.params.id, 10);

  if (isNaN(projectId)) {
    return next(notFoundError('Project not found'));
  }

  const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(projectId);
  if (!project) {
    return next(notFoundError('Project not found'));
  }

  const membership = db
    .prepare('SELECT id, role FROM project_members WHERE project_id = ? AND user_id = ?')
    .get(projectId, req.user.id);

  if (!membership) {
    return next(forbiddenError('You are not a member of this project'));
  }

  req.membership = { id: membership.id, role: membership.role };
  req.projectId = projectId;
  next();
}

module.exports = { projectAccessMiddleware };
