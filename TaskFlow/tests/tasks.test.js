/**
 * tasks.test.js
 * Tests for Task CRUD endpoints inside projects.
 * Covers AC-4.1 through AC-4.5 and AC-7.1 through AC-7.4 from the PRD.
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
let owner;
let memberToken;
let member;
let outsiderToken;
let project;

beforeAll(async () => {
  const setup = setupTestApp();
  request = setup.request;
  tmpDb = setup.tmpDb;

  ({ user: owner, token: ownerToken } = await createTestUser(request, {
    name: 'Task Owner',
    email: 'taskowner@tasks.test',
    password: 'TaskOwner1',
  }));
  ({ user: member, token: memberToken } = await createTestUser(request, {
    name: 'Task Member',
    email: 'taskmember@tasks.test',
    password: 'TaskMember1',
  }));
  ({ token: outsiderToken } = await createTestUser(request, {
    name: 'Task Outsider',
    email: 'taskoutsider@tasks.test',
    password: 'Outsider11',
  }));

  project = await createTestProject(request, ownerToken, { name: 'Task Test Project' });

  await request
    .post(`/api/projects/${project.id}/members`)
    .set(authHeader(ownerToken))
    .send({ email: 'taskmember@tasks.test' });
});

afterAll(() => teardownTestApp(tmpDb));

const base = () => `/api/projects/${project.id}/tasks`;

// ---------------------------------------------------------------------------
// POST /api/projects/:projectId/tasks — create task
// ---------------------------------------------------------------------------

describe('POST /api/projects/:projectId/tasks', () => {
  it('creates a task with all fields and returns 201 (AC-4.1)', async () => {
    const res = await request
      .post(base())
      .set(authHeader(ownerToken))
      .send({
        title: 'Full Featured Task',
        description: 'Detailed description here',
        status: 'in_progress',
        priority: 'high',
        due_date: '2027-01-15',
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Full Featured Task');
    expect(res.body.description).toBe('Detailed description here');
    expect(res.body.status).toBe('in_progress');
    expect(res.body.priority).toBe('high');
    expect(res.body.due_date).toBe('2027-01-15');
    expect(res.body.project_id).toBe(project.id);
    expect(res.body).toHaveProperty('id');
  });

  it('creates a task with minimum required fields only (AC-4.1)', async () => {
    const res = await request
      .post(base())
      .set(authHeader(ownerToken))
      .send({ title: 'Minimal Task' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Minimal Task');
    expect(res.body.status).toBe('todo');    // default
    expect(res.body.priority).toBe('low');   // default
    expect(res.body.assignee_id).toBeNull();
  });

  it('assigns task to a project member by assignee_id (AC-4.1)', async () => {
    const res = await request
      .post(base())
      .set(authHeader(ownerToken))
      .send({
        title: 'Assigned Task',
        assignee_id: member.id,
      });

    expect(res.status).toBe(201);
    expect(res.body.assignee_id).toBe(member.id);
    expect(res.body.assignee_name).toBe(member.name);
  });

  it('returns 400 when trying to assign to a non-member user', async () => {
    const { user: stranger } = await createTestUser(request, {
      name: 'Stranger',
      email: 'stranger@tasks.test',
      password: 'Stranger1',
    });

    const res = await request
      .post(base())
      .set(authHeader(ownerToken))
      .send({ title: 'Bad Assign', assignee_id: stranger.id });

    expect(res.status).toBe(400);
  });

  it('returns 400 when title is missing', async () => {
    const res = await request
      .post(base())
      .set(authHeader(ownerToken))
      .send({ priority: 'high' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when title exceeds 200 characters', async () => {
    const res = await request
      .post(base())
      .set(authHeader(ownerToken))
      .send({ title: 'x'.repeat(201) });

    expect(res.status).toBe(400);
  });

  it('returns 400 when status is invalid', async () => {
    const res = await request
      .post(base())
      .set(authHeader(ownerToken))
      .send({ title: 'Bad Status', status: 'backlog' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when priority value is not in allowed enum', async () => {
    const res = await request
      .post(base())
      .set(authHeader(ownerToken))
      .send({ title: 'Bad Priority', priority: 'extreme' });

    expect(res.status).toBe(400);
  });

  it('a project member (non-owner) can also create tasks (AC-4.1)', async () => {
    const res = await request
      .post(base())
      .set(authHeader(memberToken))
      .send({ title: 'Member Created Task' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Member Created Task');
  });

  it('returns 403 when an outsider tries to create a task (AC-2.6)', async () => {
    const res = await request
      .post(base())
      .set(authHeader(outsiderToken))
      .send({ title: 'Outsider Task' });

    expect(res.status).toBe(403);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request
      .post(base())
      .send({ title: 'Unauth Task' });

    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /api/projects/:projectId/tasks — list tasks
// ---------------------------------------------------------------------------

describe('GET /api/projects/:projectId/tasks', () => {
  let taskTodo1;
  let taskInProgress;
  let taskHighPriority;
  let taskWithAssignee;

  beforeAll(async () => {
    taskTodo1 = await createTestTask(request, ownerToken, project.id, {
      title: 'Todo Alpha',
      status: 'todo',
      priority: 'low',
    });
    taskInProgress = await createTestTask(request, ownerToken, project.id, {
      title: 'In Progress Beta',
      status: 'in_progress',
      priority: 'medium',
    });
    taskHighPriority = await createTestTask(request, ownerToken, project.id, {
      title: 'High Priority Gamma',
      status: 'review',
      priority: 'high',
    });
    taskWithAssignee = await createTestTask(request, ownerToken, project.id, {
      title: 'Assigned Delta with searchable text',
      status: 'todo',
      priority: 'critical',
      assignee_id: member.id,
    });
  });

  it('returns 200 with array of tasks', async () => {
    const res = await request.get(base()).set(authHeader(ownerToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
  });

  it('filters tasks by status (AC-7.1)', async () => {
    const res = await request
      .get(base())
      .query({ status: 'todo' })
      .set(authHeader(ownerToken));

    expect(res.status).toBe(200);
    const statuses = res.body.map((t) => t.status);
    expect(statuses.every((s) => s === 'todo')).toBe(true);
    expect(res.body.map((t) => t.id)).toContain(taskTodo1.id);
    expect(res.body.map((t) => t.id)).not.toContain(taskInProgress.id);
  });

  it('filters tasks by multiple statuses (comma-separated)', async () => {
    const res = await request
      .get(base())
      .query({ status: 'todo,in_progress' })
      .set(authHeader(ownerToken));

    expect(res.status).toBe(200);
    const statuses = res.body.map((t) => t.status);
    expect(statuses.every((s) => s === 'todo' || s === 'in_progress')).toBe(true);
  });

  it('filters tasks by priority (AC-7.1)', async () => {
    const res = await request
      .get(base())
      .query({ priority: 'high' })
      .set(authHeader(ownerToken));

    expect(res.status).toBe(200);
    const priorities = res.body.map((t) => t.priority);
    expect(priorities.every((p) => p === 'high')).toBe(true);
    expect(res.body.map((t) => t.id)).toContain(taskHighPriority.id);
  });

  it('filters tasks by assignee ID (AC-7.1)', async () => {
    const res = await request
      .get(base())
      .query({ assignee: member.id })
      .set(authHeader(ownerToken));

    expect(res.status).toBe(200);
    expect(res.body.every((t) => t.assignee_id === member.id)).toBe(true);
    expect(res.body.map((t) => t.id)).toContain(taskWithAssignee.id);
  });

  it('filters unassigned tasks with assignee=unassigned (AC-7.1)', async () => {
    const res = await request
      .get(base())
      .query({ assignee: 'unassigned' })
      .set(authHeader(ownerToken));

    expect(res.status).toBe(200);
    expect(res.body.every((t) => t.assignee_id === null)).toBe(true);
  });

  it('searches tasks by title substring (case-insensitive) (AC-7.3)', async () => {
    const res = await request
      .get(base())
      .query({ search: 'searchable' })
      .set(authHeader(ownerToken));

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body.map((t) => t.id)).toContain(taskWithAssignee.id);
  });

  it('search returns empty array when no tasks match', async () => {
    const res = await request
      .get(base())
      .query({ search: 'xyzzy_no_match_zyxzyx' })
      .set(authHeader(ownerToken));

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it('combines status and priority filters (AC-7.4)', async () => {
    const res = await request
      .get(base())
      .query({ status: 'todo', priority: 'critical' })
      .set(authHeader(ownerToken));

    expect(res.status).toBe(200);
    expect(res.body.every((t) => t.status === 'todo' && t.priority === 'critical')).toBe(true);
    expect(res.body.map((t) => t.id)).toContain(taskWithAssignee.id);
  });

  it('returns 403 for outsider', async () => {
    const res = await request.get(base()).set(authHeader(outsiderToken));
    expect(res.status).toBe(403);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request.get(base());
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /api/projects/:projectId/tasks/:id — get single task
// ---------------------------------------------------------------------------

describe('GET /api/projects/:projectId/tasks/:id', () => {
  let task;

  beforeAll(async () => {
    task = await createTestTask(request, ownerToken, project.id, {
      title: 'Single Task',
      description: 'For detail view',
    });
  });

  it('returns 200 with task detail for a project member (AC-4.2)', async () => {
    const res = await request
      .get(`${base()}/${task.id}`)
      .set(authHeader(ownerToken));

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(task.id);
    expect(res.body.title).toBe('Single Task');
    expect(res.body).toHaveProperty('creator_name');
  });

  it('returns 404 for a non-existent task', async () => {
    const res = await request
      .get(`${base()}/999999`)
      .set(authHeader(ownerToken));

    expect(res.status).toBe(404);
  });

  it('returns 403 for outsider', async () => {
    const res = await request
      .get(`${base()}/${task.id}`)
      .set(authHeader(outsiderToken));

    expect(res.status).toBe(403);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/projects/:projectId/tasks/:id — update task
// ---------------------------------------------------------------------------

describe('PUT /api/projects/:projectId/tasks/:id', () => {
  let task;

  beforeAll(async () => {
    task = await createTestTask(request, ownerToken, project.id, {
      title: 'Updateable Task',
      priority: 'low',
      status: 'todo',
    });
  });

  it('updates task title and returns 200 (AC-4.3)', async () => {
    const res = await request
      .put(`${base()}/${task.id}`)
      .set(authHeader(ownerToken))
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('updates task priority (AC-4.3)', async () => {
    const res = await request
      .put(`${base()}/${task.id}`)
      .set(authHeader(ownerToken))
      .send({ priority: 'critical' });

    expect(res.status).toBe(200);
    expect(res.body.priority).toBe('critical');
  });

  it('updates task status (AC-4.3)', async () => {
    const res = await request
      .put(`${base()}/${task.id}`)
      .set(authHeader(ownerToken))
      .send({ status: 'in_progress' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('in_progress');
  });

  it('a project member (non-owner) can update tasks (AC-4.3)', async () => {
    const res = await request
      .put(`${base()}/${task.id}`)
      .set(authHeader(memberToken))
      .send({ title: 'Member Updated' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Member Updated');
  });

  it('returns 400 when no fields are provided', async () => {
    const res = await request
      .put(`${base()}/${task.id}`)
      .set(authHeader(ownerToken))
      .send({});

    expect(res.status).toBe(400);
  });

  it('returns 404 for a non-existent task', async () => {
    const res = await request
      .put(`${base()}/999999`)
      .set(authHeader(ownerToken))
      .send({ title: 'Ghost Task' });

    expect(res.status).toBe(404);
  });

  it('returns 403 for outsider', async () => {
    const res = await request
      .put(`${base()}/${task.id}`)
      .set(authHeader(outsiderToken))
      .send({ title: 'Outsider Update' });

    expect(res.status).toBe(403);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/projects/:projectId/tasks/:id/move — move task
// ---------------------------------------------------------------------------

describe('PATCH /api/projects/:projectId/tasks/:id/move', () => {
  let task;

  beforeAll(async () => {
    task = await createTestTask(request, ownerToken, project.id, {
      title: 'Moveable Task',
      status: 'todo',
    });
  });

  it('moves task to a different column and returns 200 (AC-3.3)', async () => {
    const res = await request
      .patch(`${base()}/${task.id}/move`)
      .set(authHeader(ownerToken))
      .send({ status: 'in_progress', position: 0 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('in_progress');
    expect(res.body.position).toBe(0);
  });

  it('move persists — a subsequent GET reflects the new status (AC-3.3)', async () => {
    await request
      .patch(`${base()}/${task.id}/move`)
      .set(authHeader(ownerToken))
      .send({ status: 'review', position: 0 });

    const res = await request
      .get(`${base()}/${task.id}`)
      .set(authHeader(ownerToken));

    expect(res.body.status).toBe('review');
  });

  it('returns 400 when status is missing', async () => {
    const res = await request
      .patch(`${base()}/${task.id}/move`)
      .set(authHeader(ownerToken))
      .send({ position: 0 });

    expect(res.status).toBe(400);
  });

  it('returns 400 when position is missing', async () => {
    const res = await request
      .patch(`${base()}/${task.id}/move`)
      .set(authHeader(ownerToken))
      .send({ status: 'todo' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when status value is invalid', async () => {
    const res = await request
      .patch(`${base()}/${task.id}/move`)
      .set(authHeader(ownerToken))
      .send({ status: 'invalid_col', position: 0 });

    expect(res.status).toBe(400);
  });

  it('returns 404 for a non-existent task', async () => {
    const res = await request
      .patch(`${base()}/999999/move`)
      .set(authHeader(ownerToken))
      .send({ status: 'done', position: 0 });

    expect(res.status).toBe(404);
  });

  it('returns 403 for outsider', async () => {
    const res = await request
      .patch(`${base()}/${task.id}/move`)
      .set(authHeader(outsiderToken))
      .send({ status: 'done', position: 0 });

    expect(res.status).toBe(403);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/projects/:projectId/tasks/:id — delete task
// ---------------------------------------------------------------------------

describe('DELETE /api/projects/:projectId/tasks/:id', () => {
  it('deletes a task and returns 204 (AC-4.4)', async () => {
    const task = await createTestTask(request, ownerToken, project.id, {
      title: 'Delete Me',
    });

    const res = await request
      .delete(`${base()}/${task.id}`)
      .set(authHeader(ownerToken));

    expect(res.status).toBe(204);

    const check = await request
      .get(`${base()}/${task.id}`)
      .set(authHeader(ownerToken));
    expect(check.status).toBe(404);
  });

  it('a project member (non-owner) can delete tasks', async () => {
    const task = await createTestTask(request, ownerToken, project.id, {
      title: 'Delete By Member',
    });

    const res = await request
      .delete(`${base()}/${task.id}`)
      .set(authHeader(memberToken));

    expect(res.status).toBe(204);
  });

  it('returns 404 when deleting a non-existent task', async () => {
    const res = await request
      .delete(`${base()}/999999`)
      .set(authHeader(ownerToken));

    expect(res.status).toBe(404);
  });

  it('returns 403 for outsider', async () => {
    const task = await createTestTask(request, ownerToken, project.id, {
      title: 'Outsider Delete Target',
    });

    const res = await request
      .delete(`${base()}/${task.id}`)
      .set(authHeader(outsiderToken));

    expect(res.status).toBe(403);
  });

  it('returns 401 when unauthenticated', async () => {
    const task = await createTestTask(request, ownerToken, project.id, {
      title: 'Unauth Delete Target',
    });

    const res = await request.delete(`${base()}/${task.id}`);
    expect(res.status).toBe(401);
  });
});
