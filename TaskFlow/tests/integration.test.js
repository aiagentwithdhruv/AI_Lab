/**
 * integration.test.js
 * End-to-end integration flows testing real user journeys.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  setupTestApp,
  teardownTestApp,
  createTestUser,
  authHeader,
} from './test-helpers.js';

let request;
let tmpDb;

beforeAll(() => {
  const setup = setupTestApp();
  request = setup.request;
  tmpDb = setup.tmpDb;
});

afterAll(() => teardownTestApp(tmpDb));

// ---------------------------------------------------------------------------
// Flow 1: Complete happy path for a single user
// ---------------------------------------------------------------------------

describe('Integration: Complete single-user flow', () => {
  it('signup → login → create project → add task → move task → view analytics', async () => {
    // 1. Sign up
    const signupRes = await request.post('/api/auth/signup').send({
      name: 'Sarah Flow',
      email: 'sarah.flow@integration.test',
      password: 'FlowTest1',
    });
    expect(signupRes.status).toBe(201);
    const { token, user } = signupRes.body;

    // 2. Login with the same credentials
    const loginRes = await request.post('/api/auth/login').send({
      email: 'sarah.flow@integration.test',
      password: 'FlowTest1',
    });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.user.id).toBe(user.id);

    // 3. Create a project
    const projectRes = await request
      .post('/api/projects')
      .set(authHeader(token))
      .send({ name: 'Integration Project Alpha', description: 'Full flow test' });
    expect(projectRes.status).toBe(201);
    const project = projectRes.body;
    expect(project.owner_id).toBe(user.id);

    // 4. Project appears in list
    const listRes = await request.get('/api/projects').set(authHeader(token));
    expect(listRes.status).toBe(200);
    expect(listRes.body.some((p) => p.id === project.id)).toBe(true);

    // 5. Create a task
    const taskRes = await request
      .post(`/api/projects/${project.id}/tasks`)
      .set(authHeader(token))
      .send({
        title: 'Implement login page',
        description: 'Build the login form with validation',
        priority: 'high',
        status: 'todo',
        due_date: '2027-06-30',
      });
    expect(taskRes.status).toBe(201);
    const task = taskRes.body;
    expect(task.status).toBe('todo');

    // 6. Move to in_progress
    const moveRes = await request
      .patch(`/api/projects/${project.id}/tasks/${task.id}/move`)
      .set(authHeader(token))
      .send({ status: 'in_progress', position: 0 });
    expect(moveRes.status).toBe(200);
    expect(moveRes.body.status).toBe('in_progress');

    // 7. Move to done
    const doneRes = await request
      .patch(`/api/projects/${project.id}/tasks/${task.id}/move`)
      .set(authHeader(token))
      .send({ status: 'done', position: 0 });
    expect(doneRes.status).toBe(200);
    expect(doneRes.body.status).toBe('done');

    // 8. Analytics — done count = 1
    const analyticsRes = await request
      .get(`/api/projects/${project.id}/analytics`)
      .set(authHeader(token));
    expect(analyticsRes.status).toBe(200);
    expect(analyticsRes.body.tasksByStatus.done).toBe(1);
    expect(analyticsRes.body.tasksByStatus.in_progress).toBe(0);

    // 9. Update project name
    const updateRes = await request
      .put(`/api/projects/${project.id}`)
      .set(authHeader(token))
      .send({ name: 'Integration Project Alpha Done' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe('Integration Project Alpha Done');

    // 10. Delete the task
    const deleteTaskRes = await request
      .delete(`/api/projects/${project.id}/tasks/${task.id}`)
      .set(authHeader(token));
    expect(deleteTaskRes.status).toBe(204);

    // 11. Delete the project
    const deleteProjectRes = await request
      .delete(`/api/projects/${project.id}`)
      .set(authHeader(token));
    expect(deleteProjectRes.status).toBe(204);

    // 12. Project is gone
    const goneRes = await request
      .get(`/api/projects/${project.id}`)
      .set(authHeader(token));
    expect(goneRes.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// Flow 2: Multi-user collaboration
// ---------------------------------------------------------------------------

describe('Integration: Multi-user collaboration flow', () => {
  let userAToken;
  let userA;
  let userBToken;
  let userB;
  let sharedProject;
  let sharedTask;

  beforeAll(async () => {
    const resA = await request.post('/api/auth/signup').send({
      name: 'User Alpha',
      email: 'alpha@integration.test',
      password: 'AlphaUser1',
    });
    userA = resA.body.user;
    userAToken = resA.body.token;

    const resB = await request.post('/api/auth/signup').send({
      name: 'User Beta',
      email: 'beta@integration.test',
      password: 'BetaUser11',
    });
    userB = resB.body.user;
    userBToken = resB.body.token;

    const projectRes = await request
      .post('/api/projects')
      .set(authHeader(userAToken))
      .send({ name: 'Shared Collab Project', description: 'Multi-user test' });
    sharedProject = projectRes.body;

    await request
      .post(`/api/projects/${sharedProject.id}/members`)
      .set(authHeader(userAToken))
      .send({ email: 'beta@integration.test' });

    const taskRes = await request
      .post(`/api/projects/${sharedProject.id}/tasks`)
      .set(authHeader(userAToken))
      .send({
        title: 'Task for Beta',
        description: 'Beta should complete this',
        priority: 'medium',
        assignee_id: userB.id,
      });
    sharedTask = taskRes.body;
  });

  it('User B can see the shared project in their project list', async () => {
    const res = await request.get('/api/projects').set(authHeader(userBToken));

    expect(res.status).toBe(200);
    expect(res.body.some((p) => p.id === sharedProject.id)).toBe(true);
  });

  it('User B can see the task assigned to them', async () => {
    const res = await request
      .get(`/api/projects/${sharedProject.id}/tasks`)
      .set(authHeader(userBToken));

    expect(res.status).toBe(200);
    const task = res.body.find((t) => t.id === sharedTask.id);
    expect(task).toBeDefined();
    expect(task.assignee_id).toBe(userB.id);
    expect(task.assignee_name).toBe(userB.name);
  });

  it('User B can move a task to in_progress', async () => {
    const res = await request
      .patch(`/api/projects/${sharedProject.id}/tasks/${sharedTask.id}/move`)
      .set(authHeader(userBToken))
      .send({ status: 'in_progress', position: 0 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('in_progress');
  });

  it('User A can see the task status updated by User B', async () => {
    const res = await request
      .get(`/api/projects/${sharedProject.id}/tasks/${sharedTask.id}`)
      .set(authHeader(userAToken));

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('in_progress');
  });

  it('User B (non-owner) cannot invite members (AC-5.6)', async () => {
    await request.post('/api/auth/signup').send({
      name: 'User Gamma',
      email: 'gamma@integration.test',
      password: 'GammaUser1',
    });

    const res = await request
      .post(`/api/projects/${sharedProject.id}/members`)
      .set(authHeader(userBToken))
      .send({ email: 'gamma@integration.test' });

    expect(res.status).toBe(403);
  });

  it('User A (owner) can invite Gamma', async () => {
    const res = await request
      .post(`/api/projects/${sharedProject.id}/members`)
      .set(authHeader(userAToken))
      .send({ email: 'gamma@integration.test' });

    expect(res.status).toBe(201);
  });

  it('analytics show in_progress count as 1 after User B moved the task', async () => {
    const res = await request
      .get(`/api/projects/${sharedProject.id}/analytics`)
      .set(authHeader(userAToken));

    expect(res.status).toBe(200);
    expect(res.body.tasksByStatus.in_progress).toBe(1);
  });

  it('User A can remove User B from the project', async () => {
    const res = await request
      .delete(`/api/projects/${sharedProject.id}/members/${userB.id}`)
      .set(authHeader(userAToken));

    expect(res.status).toBe(204);
  });

  it('after removal, User B cannot access the project anymore (AC-5.4)', async () => {
    const res = await request
      .get(`/api/projects/${sharedProject.id}`)
      .set(authHeader(userBToken));

    expect(res.status).toBe(403);
  });

  it('task previously assigned to User B has assignee cleared after removal (AC-5.4)', async () => {
    const res = await request
      .get(`/api/projects/${sharedProject.id}/tasks/${sharedTask.id}`)
      .set(authHeader(userAToken));

    expect(res.status).toBe(200);
    expect(res.body.assignee_id).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Flow 3: Unauthorized access attempts
// ---------------------------------------------------------------------------

describe('Integration: Unauthorized access boundary tests', () => {
  let ownerToken;
  let privateProject;
  let hackerToken;

  beforeAll(async () => {
    const resOwner = await request.post('/api/auth/signup').send({
      name: 'Private Owner',
      email: 'private.owner@integration.test',
      password: 'PrivOwner1',
    });
    ownerToken = resOwner.body.token;

    const resHacker = await request.post('/api/auth/signup').send({
      name: 'Hacker Harry',
      email: 'hacker@integration.test',
      password: 'HackerH111',
    });
    hackerToken = resHacker.body.token;

    const projectRes = await request
      .post('/api/projects')
      .set(authHeader(ownerToken))
      .send({ name: 'Private Project' });
    privateProject = projectRes.body;

    await request
      .post(`/api/projects/${privateProject.id}/tasks`)
      .set(authHeader(ownerToken))
      .send({ title: 'Secret Task', priority: 'critical' });
  });

  it('hacker cannot see the private project in their project list', async () => {
    const res = await request.get('/api/projects').set(authHeader(hackerToken));
    expect(res.body.every((p) => p.id !== privateProject.id)).toBe(true);
  });

  it('hacker gets 403 when trying to GET the project directly (AC-2.6)', async () => {
    const res = await request
      .get(`/api/projects/${privateProject.id}`)
      .set(authHeader(hackerToken));
    expect(res.status).toBe(403);
  });

  it('hacker gets 403 when trying to list tasks', async () => {
    const res = await request
      .get(`/api/projects/${privateProject.id}/tasks`)
      .set(authHeader(hackerToken));
    expect(res.status).toBe(403);
  });

  it('hacker gets 403 when trying to create a task', async () => {
    const res = await request
      .post(`/api/projects/${privateProject.id}/tasks`)
      .set(authHeader(hackerToken))
      .send({ title: 'Injected Task' });
    expect(res.status).toBe(403);
  });

  it('hacker gets 403 when trying to see analytics', async () => {
    const res = await request
      .get(`/api/projects/${privateProject.id}/analytics`)
      .set(authHeader(hackerToken));
    expect(res.status).toBe(403);
  });

  it('hacker gets 403 when trying to delete the project', async () => {
    const res = await request
      .delete(`/api/projects/${privateProject.id}`)
      .set(authHeader(hackerToken));
    expect(res.status).toBe(403);
  });
});

// ---------------------------------------------------------------------------
// Flow 4: Task lifecycle with activity tracking
// ---------------------------------------------------------------------------

describe('Integration: Task lifecycle with activity log', () => {
  let token;
  let project;

  beforeAll(async () => {
    const res = await request.post('/api/auth/signup').send({
      name: 'Activity Tracker',
      email: 'activity@integration.test',
      password: 'Activity11',
    });
    token = res.body.token;

    const projectRes = await request
      .post('/api/projects')
      .set(authHeader(token))
      .send({ name: 'Activity Flow Project' });
    project = projectRes.body;
  });

  it('activity endpoint is reachable and returns paginated response (AC-6.1)', async () => {
    const res = await request
      .get(`/api/projects/${project.id}/activity`)
      .set(authHeader(token));

    expect(res.status).toBe(200);
    // Activity route returns { activities: [...], total, limit, offset }
    expect(res.body).toHaveProperty('activities');
    expect(Array.isArray(res.body.activities)).toBe(true);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('limit');
    expect(res.body).toHaveProperty('offset');
  });

  it('creating a task generates a created_task activity entry (AC-6.3)', async () => {
    await request
      .post(`/api/projects/${project.id}/tasks`)
      .set(authHeader(token))
      .send({ title: 'Activity Task' });

    const res = await request
      .get(`/api/projects/${project.id}/activity`)
      .set(authHeader(token));

    const entry = res.body.activities.find((e) => e.action === 'created_task');
    expect(entry).toBeDefined();
  });

  it('activity entries have required fields (AC-6.2)', async () => {
    const res = await request
      .get(`/api/projects/${project.id}/activity`)
      .set(authHeader(token));

    for (const entry of res.body.activities) {
      expect(entry).toHaveProperty('action');
      expect(entry).toHaveProperty('entity_type');
      expect(entry).toHaveProperty('created_at');
    }
  });
});

// ---------------------------------------------------------------------------
// Flow 5: Query parameter edge cases
// ---------------------------------------------------------------------------

describe('Integration: Query parameter edge cases', () => {
  let token;
  let project;

  beforeAll(async () => {
    const res = await request.post('/api/auth/signup').send({
      name: 'Query Tester',
      email: 'query@integration.test',
      password: 'QueryTest1',
    });
    token = res.body.token;

    const projectRes = await request
      .post('/api/projects')
      .set(authHeader(token))
      .send({ name: 'Query Test Project' });
    project = projectRes.body;

    for (let i = 0; i < 3; i++) {
      await request
        .post(`/api/projects/${project.id}/tasks`)
        .set(authHeader(token))
        .send({ title: `Query Task ${i}`, priority: i % 2 === 0 ? 'low' : 'high' });
    }
  });

  it('empty search term returns all tasks', async () => {
    const res = await request
      .get(`/api/projects/${project.id}/tasks`)
      .query({ search: '' })
      .set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });

  it('due_before filter excludes tasks without due dates', async () => {
    const res = await request
      .get(`/api/projects/${project.id}/tasks`)
      .query({ due_before: '2020-01-01' })
      .set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it('due_after with a far-future date returns nothing', async () => {
    const res = await request
      .get(`/api/projects/${project.id}/tasks`)
      .query({ due_after: '2099-12-31' })
      .set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it('combined priority + search filters both apply (AC-7.4)', async () => {
    const res = await request
      .get(`/api/projects/${project.id}/tasks`)
      .query({ priority: 'high', search: 'Query Task' })
      .set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.every((t) => t.priority === 'high')).toBe(true);
    expect(res.body.every((t) => t.title.includes('Query Task'))).toBe(true);
  });
});
