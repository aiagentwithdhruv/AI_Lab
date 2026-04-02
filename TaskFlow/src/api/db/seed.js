const bcrypt = require('bcryptjs');
const { getDb } = require('./database');

function seedDatabase() {
  const db = getDb();

  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (userCount > 0) {
    console.log('Database already seeded, skipping.');
    return;
  }

  console.log('Seeding database...');

  const hash1 = bcrypt.hashSync('password123', 10);
  const hash2 = bcrypt.hashSync('password123', 10);

  const seed = db.transaction(() => {
    // Users
    db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(
      'Alice Johnson',
      'alice@example.com',
      hash1
    );
    db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(
      'Bob Smith',
      'bob@example.com',
      hash2
    );

    // Project
    db.prepare('INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)').run(
      'TaskFlow Demo',
      'A demonstration project for TaskFlow with sample tasks and team members.',
      1
    );

    // Project members: Alice as owner, Bob as member
    db.prepare('INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)').run(1, 1, 'owner');
    db.prepare('INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)').run(1, 2, 'member');

    // Tasks (5 tasks across different statuses/priorities/assignees)
    db.prepare(
      'INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, due_date, position, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(1, 'Design homepage mockup', 'Create high-fidelity mockup for the new homepage layout.', 'todo', 'high', 1, '2026-04-15', 0, 1);

    db.prepare(
      'INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, due_date, position, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(1, 'Set up CI/CD pipeline', 'Configure GitHub Actions for automated testing and deployment.', 'in_progress', 'critical', 2, '2026-04-01', 0, 1);

    db.prepare(
      'INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, due_date, position, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(1, 'Write API documentation', 'Document all REST endpoints with request/response examples.', 'review', 'medium', 1, '2026-04-10', 0, 2);

    db.prepare(
      'INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, due_date, position, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(1, 'Implement user authentication', 'Build login and signup flows with JWT tokens.', 'done', 'critical', 2, '2026-03-20', 0, 1);

    db.prepare(
      'INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, due_date, position, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(1, 'Create database schema', 'Design and implement SQLite schema with all tables and indexes.', 'todo', 'low', null, null, 1, 2);

    // Activity log entries
    db.prepare(
      'INSERT INTO activity_log (project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(1, 1, 'created_task', 'task', 1, JSON.stringify({ title: 'Design homepage mockup' }));

    db.prepare(
      'INSERT INTO activity_log (project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(1, 1, 'created_task', 'task', 2, JSON.stringify({ title: 'Set up CI/CD pipeline' }));

    db.prepare(
      'INSERT INTO activity_log (project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(1, 2, 'created_task', 'task', 3, JSON.stringify({ title: 'Write API documentation' }));

    db.prepare(
      'INSERT INTO activity_log (project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(1, 1, 'moved_task', 'task', 2, JSON.stringify({ from_status: 'todo', to_status: 'in_progress' }));

    db.prepare(
      'INSERT INTO activity_log (project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(1, 1, 'moved_task', 'task', 4, JSON.stringify({ from_status: 'in_progress', to_status: 'done' }));

    db.prepare(
      'INSERT INTO activity_log (project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(1, 1, 'added_member', 'member', 2, JSON.stringify({ email: 'bob@example.com' }));
  });

  seed();
  console.log('Database seeded successfully.');
}

module.exports = { seedDatabase };
