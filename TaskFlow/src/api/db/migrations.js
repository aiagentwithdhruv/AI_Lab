const { getDb } = require('./database');

function runMigrations() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const applied = new Set(
    db.prepare('SELECT name FROM _migrations').all().map((r) => r.name)
  );

  const migrations = [
    {
      name: '001_initial_schema',
      up: () => {
        db.exec(`
          CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT    NOT NULL,
            email         TEXT    NOT NULL UNIQUE,
            password_hash TEXT    NOT NULL,
            created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
            updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
          );

          CREATE TABLE IF NOT EXISTS projects (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            description TEXT    DEFAULT '',
            owner_id    INTEGER NOT NULL,
            created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
            updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (owner_id) REFERENCES users(id)
          );

          CREATE TABLE IF NOT EXISTS project_members (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id  INTEGER NOT NULL,
            user_id     INTEGER NOT NULL,
            role        TEXT    NOT NULL DEFAULT 'member',
            joined_at   TEXT    NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE (project_id, user_id)
          );

          CREATE TABLE IF NOT EXISTS tasks (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id  INTEGER NOT NULL,
            title       TEXT    NOT NULL,
            description TEXT    DEFAULT '',
            status      TEXT    NOT NULL DEFAULT 'todo'
                                CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
            priority    TEXT    NOT NULL DEFAULT 'low'
                                CHECK (priority IN ('low', 'medium', 'high', 'critical')),
            assignee_id INTEGER,
            due_date    TEXT,
            position    INTEGER NOT NULL DEFAULT 0,
            created_by  INTEGER NOT NULL,
            created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
            updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (project_id)  REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (assignee_id) REFERENCES users(id)    ON DELETE SET NULL,
            FOREIGN KEY (created_by)  REFERENCES users(id)
          );

          CREATE TABLE IF NOT EXISTS activity_log (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id  INTEGER NOT NULL,
            user_id     INTEGER NOT NULL,
            action      TEXT    NOT NULL,
            entity_type TEXT    NOT NULL,
            entity_id   INTEGER NOT NULL,
            details     TEXT    DEFAULT '{}',
            created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id)    REFERENCES users(id)
          );

          CREATE INDEX IF NOT EXISTS idx_tasks_project_status ON tasks(project_id, status);
          CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
          CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id);
          CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_members(user_id);
          CREATE INDEX IF NOT EXISTS idx_activity_project_created ON activity_log(project_id, created_at);
        `);
      },
    },
  ];

  const insert = db.prepare('INSERT INTO _migrations (name) VALUES (?)');

  for (const migration of migrations) {
    if (!applied.has(migration.name)) {
      const run = db.transaction(() => {
        migration.up();
        insert.run(migration.name);
      });
      run();
      console.log(`Migration applied: ${migration.name}`);
    }
  }
}

module.exports = { runMigrations };
