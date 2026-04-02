/**
 * analytics.test.js
 * Tests for GET /api/projects/:projectId/analytics
 * Covers P1-1 (Analytics Dashboard) from the PRD.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  setupTestApp,
  teardownTestApp,
  createTestUser,
  createTestProject,
  createTestTask,
  authHeader,
} from './test-helpers.js';

let request;
let tmpDb;
let ownerToken;
let outsiderToken;
let emptyProject;
let richProject;

beforeAll(async () => {
  const setup = setupTestApp();
  request = setup.request;
  tmpDb = setup.tmpDb;

  ({ token: ownerToken } = await createTestUser(request, {
    name: 'Analytics Owner',
    email: 'analyticsowner@analytics.test',
    password: 'Analytics1',
  }));

  ({ token: outsiderToken } = await createTestUser(request, {
    name: 'Analytics Outsider',
    email: 'analyticsoutsider@analytics.test',
    password: 'Outsider11',
  }));

  emptyProject = await createTestProject(request, ownerToken, { name: 'Empty Analytics Project' });

  richProject = await createTestProject(request, ownerToken, { name: 'Rich Analytics Project' });

  await createTestTask(request, ownerToken, richProject.id, { title: 'T1', status: 'todo', priority: 'low' });
  await createTestTask(request, ownerToken, richProject.id, { title: 'T2', status: 'todo', priority: 'high' });
  await createTestTask(request, ownerToken, richProject.id, { title: 'T3', status: 'in_progress', priority: 'medium' });
  await createTestTask(request, ownerToken, richProject.id, { title: 'T4', status: 'review', priority: 'critical' });
  await createTestTask(request, ownerToken, richProject.id, { title: 'T5', status: 'done', priority: 'low' });
  await createTestTask(request, ownerToken, richProject.id, { title: 'T6', status: 'done', priority: 'medium' });
  // Overdue task
  await createTestTask(request, ownerToken, richProject.id, {
    title: 'Overdue Task',
    status: 'todo',
    priority: 'high',
    due_date: '2020-01-01',
  });
});

afterAll(() => teardownTestApp(tmpDb));

const analyticsUrl = (projectId) => `/api/projects/${projectId}/analytics`;

// ---------------------------------------------------------------------------
// Analytics with tasks
// ---------------------------------------------------------------------------

describe('GET /api/projects/:projectId/analytics — with tasks', () => {
  it('returns 200 with expected shape', async () => {
    const res = await request
      .get(analyticsUrl(richProject.id))
      .set(authHeader(ownerToken));

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('tasksByStatus');
    expect(res.body).toHaveProperty('tasksByAssignee');
    expect(res.body).toHaveProperty('overdueCount');
    expect(res.body).toHaveProperty('overdueTasks');
    expect(res.body).toHaveProperty('burndown');
  });

  it('tasksByStatus has all four Kanban columns', async () => {
    const res = await request
      .get(analyticsUrl(richProject.id))
      .set(authHeader(ownerToken));

    const { tasksByStatus } = res.body;
    expect(tasksByStatus).toHaveProperty('todo');
    expect(tasksByStatus).toHaveProperty('in_progress');
    expect(tasksByStatus).toHaveProperty('review');
    expect(tasksByStatus).toHaveProperty('done');
  });

  it('tasksByStatus counts are correct', async () => {
    const res = await request
      .get(analyticsUrl(richProject.id))
      .set(authHeader(ownerToken));

    const { tasksByStatus } = res.body;
    // T1 + T2 + Overdue Task = 3 todo
    expect(tasksByStatus.todo).toBe(3);
    expect(tasksByStatus.in_progress).toBe(1);
    expect(tasksByStatus.review).toBe(1);
    expect(tasksByStatus.done).toBe(2);
  });

  it('overdueCount reflects the number of past-due non-done tasks', async () => {
    const res = await request
      .get(analyticsUrl(richProject.id))
      .set(authHeader(ownerToken));

    expect(res.body.overdueCount).toBeGreaterThanOrEqual(1);
    const titles = res.body.overdueTasks.map((t) => t.title);
    expect(titles).toContain('Overdue Task');
  });

  it('overdueTasks items have required fields and are not done', async () => {
    const res = await request
      .get(analyticsUrl(richProject.id))
      .set(authHeader(ownerToken));

    for (const t of res.body.overdueTasks) {
      expect(t).toHaveProperty('id');
      expect(t).toHaveProperty('title');
      expect(t).toHaveProperty('due_date');
      expect(t).toHaveProperty('status');
      expect(t.status).not.toBe('done');
    }
  });

  it('tasksByAssignee is an array', async () => {
    const res = await request
      .get(analyticsUrl(richProject.id))
      .set(authHeader(ownerToken));

    expect(Array.isArray(res.body.tasksByAssignee)).toBe(true);
  });

  it('tasksByAssignee includes an "Unassigned" group for unassigned tasks', async () => {
    const res = await request
      .get(analyticsUrl(richProject.id))
      .set(authHeader(ownerToken));

    const unassigned = res.body.tasksByAssignee.find((g) => g.assignee_name === 'Unassigned');
    expect(unassigned).toBeDefined();
    expect(unassigned.count).toBeGreaterThanOrEqual(1);
  });

  it('burndown is an array of {date, remaining} objects', async () => {
    const res = await request
      .get(analyticsUrl(richProject.id))
      .set(authHeader(ownerToken));

    expect(Array.isArray(res.body.burndown)).toBe(true);
    for (const point of res.body.burndown) {
      expect(point).toHaveProperty('date');
      expect(point).toHaveProperty('remaining');
      expect(typeof point.remaining).toBe('number');
    }
  });
});

// ---------------------------------------------------------------------------
// Analytics with no tasks (empty project)
// ---------------------------------------------------------------------------

describe('GET /api/projects/:projectId/analytics — empty project', () => {
  it('returns 200 even when project has no tasks', async () => {
    const res = await request
      .get(analyticsUrl(emptyProject.id))
      .set(authHeader(ownerToken));

    expect(res.status).toBe(200);
  });

  it('tasksByStatus is all zeros for empty project', async () => {
    const res = await request
      .get(analyticsUrl(emptyProject.id))
      .set(authHeader(ownerToken));

    const { tasksByStatus } = res.body;
    expect(tasksByStatus.todo).toBe(0);
    expect(tasksByStatus.in_progress).toBe(0);
    expect(tasksByStatus.review).toBe(0);
    expect(tasksByStatus.done).toBe(0);
  });

  it('overdueCount is 0 for empty project', async () => {
    const res = await request
      .get(analyticsUrl(emptyProject.id))
      .set(authHeader(ownerToken));

    expect(res.body.overdueCount).toBe(0);
    expect(res.body.overdueTasks).toHaveLength(0);
  });

  it('tasksByAssignee is empty array for empty project', async () => {
    const res = await request
      .get(analyticsUrl(emptyProject.id))
      .set(authHeader(ownerToken));

    expect(res.body.tasksByAssignee).toHaveLength(0);
  });

  it('burndown returns a valid array for empty project', async () => {
    const res = await request
      .get(analyticsUrl(emptyProject.id))
      .set(authHeader(ownerToken));

    expect(Array.isArray(res.body.burndown)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Access control
// ---------------------------------------------------------------------------

describe('GET /api/projects/:projectId/analytics — access control', () => {
  it('returns 403 for a non-member (AC-2.6)', async () => {
    const res = await request
      .get(analyticsUrl(richProject.id))
      .set(authHeader(outsiderToken));

    expect(res.status).toBe(403);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request.get(analyticsUrl(richProject.id));
    expect(res.status).toBe(401);
  });

  it('returns 404 for a non-existent project', async () => {
    const res = await request
      .get('/api/projects/999999/analytics')
      .set(authHeader(ownerToken));

    expect(res.status).toBe(404);
  });
});
