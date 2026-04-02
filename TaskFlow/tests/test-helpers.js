/**
 * test-helpers.js
 * Shared utilities for all TaskFlow API tests.
 *
 * Strategy:
 * - The API source uses CommonJS (require). We load it via createRequire so
 *   it works from inside an ESM test file context.
 * - Each test file calls setupTestApp() to get a fresh supertest agent
 *   bound to a clean, isolated SQLite temp database.
 * - DB_PATH is set before the API modules are required so the singleton
 *   in database.js points to the right file.
 * - teardownTestApp() closes the DB and deletes the temp file.
 */

import { createRequire } from 'module';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

/**
 * Boot the Express app against a fresh temp database.
 * Returns { request, tmpDb }.
 */
export function setupTestApp() {
  const tmpDb = path.join(
    os.tmpdir(),
    `taskflow_test_${Date.now()}_${Math.random().toString(36).slice(2)}.db`
  );

  // Set env vars BEFORE requiring any API module.
  process.env.DB_PATH = tmpDb;
  process.env.JWT_SECRET = 'test-secret-key';

  // Purge any previously cached API modules so each test file starts fresh.
  const moduleIds = Object.keys(require.cache).filter(
    (id) => id.includes('/src/api/') && !id.includes('/node_modules/')
  );
  for (const id of moduleIds) {
    delete require.cache[id];
  }

  const app = require('../src/api/server');
  const supertest = require('supertest');
  const request = supertest(app);

  return { request, tmpDb };
}

/**
 * Close the DB and remove the temp file.
 * Call in afterAll.
 */
export function teardownTestApp(tmpDb) {
  try {
    const moduleId = Object.keys(require.cache).find(
      (id) => id.includes('/src/api/db/database.js')
    );
    if (moduleId) {
      const { closeDb } = require.cache[moduleId].exports;
      if (typeof closeDb === 'function') closeDb();
    }
  } catch (_) {
    // best-effort
  }
  try {
    if (tmpDb && fs.existsSync(tmpDb)) fs.unlinkSync(tmpDb);
  } catch (_) {
    // best-effort
  }
}

// ---------------------------------------------------------------------------
// Data factories
// ---------------------------------------------------------------------------

export async function createTestUser(request, overrides = {}) {
  const ts = `${Date.now()}${Math.random().toString(36).slice(2)}`;
  const defaults = {
    name: `Test User ${ts}`,
    email: `test_${ts}@example.com`,
    password: 'Password1',
  };
  const payload = { ...defaults, ...overrides };
  const res = await request.post('/api/auth/signup').send(payload);
  if (res.status !== 201) {
    throw new Error(`createTestUser failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return { user: res.body.user, token: res.body.token, credentials: payload };
}

export async function loginUser(request, email, password) {
  const res = await request.post('/api/auth/login').send({ email, password });
  if (res.status !== 200) {
    throw new Error(`loginUser failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return { user: res.body.user, token: res.body.token };
}

export async function createTestProject(request, token, overrides = {}) {
  const defaults = {
    name: `Test Project ${Date.now()}`,
    description: 'A project created by test helpers',
  };
  const payload = { ...defaults, ...overrides };
  const res = await request
    .post('/api/projects')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);
  if (res.status !== 201) {
    throw new Error(`createTestProject failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body;
}

export async function createTestTask(request, token, projectId, overrides = {}) {
  const defaults = {
    title: `Test Task ${Date.now()}`,
    priority: 'low',
  };
  const payload = { ...defaults, ...overrides };
  const res = await request
    .post(`/api/projects/${projectId}/tasks`)
    .set('Authorization', `Bearer ${token}`)
    .send(payload);
  if (res.status !== 201) {
    throw new Error(`createTestTask failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body;
}

export function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}
