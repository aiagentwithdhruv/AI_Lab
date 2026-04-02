/**
 * projects.test.js
 * Tests for Project CRUD endpoints.
 * Covers AC-2.1 through AC-2.6 from the PRD.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  setupTestApp,
  teardownTestApp,
  createTestUser,
  createTestProject,
  authHeader,
} from './test-helpers.js';

let request;
let tmpDb;
let ownerToken;
let owner;
let memberToken;
let member;
let outsiderToken;

beforeAll(async () => {
  const setup = setupTestApp();
  request = setup.request;
  tmpDb = setup.tmpDb;

  ({ user: owner, token: ownerToken } = await createTestUser(request, {
    name: 'Project Owner',
    email: 'owner@projects.test',
    password: 'OwnerPass1',
  }));

  ({ user: member, token: memberToken } = await createTestUser(request, {
    name: 'Project Member',
    email: 'member@projects.test',
    password: 'MemberPass1',
  }));

  ({ token: outsiderToken } = await createTestUser(request, {
    name: 'Outsider',
    email: 'outsider@projects.test',
    password: 'OutsiderPass1',
  }));
});

afterAll(() => teardownTestApp(tmpDb));

// ---------------------------------------------------------------------------
// POST /api/projects — create project
// ---------------------------------------------------------------------------

describe('POST /api/projects', () => {
  it('creates a project and returns 201 with project data (AC-2.1)', async () => {
    const res = await request
      .post('/api/projects')
      .set(authHeader(ownerToken))
      .send({ name: 'My First Project', description: 'A great project' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: 'My First Project',
      description: 'A great project',
      owner_id: owner.id,
    });
    expect(res.body).toHaveProperty('id');
  });

  it('sets creator as project owner automatically (AC-2.1)', async () => {
    const res = await request
      .post('/api/projects')
      .set(authHeader(ownerToken))
      .send({ name: 'Owner Auto-Set', description: '' });

    expect(res.status).toBe(201);
    expect(res.body.owner_id).toBe(owner.id);
  });

  it('creates a project with empty description (AC-2.1)', async () => {
    const res = await request
      .post('/api/projects')
      .set(authHeader(ownerToken))
      .send({ name: 'No Description Project' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('No Description Project');
  });

  it('returns 400 when name is missing', async () => {
    const res = await request
      .post('/api/projects')
      .set(authHeader(ownerToken))
      .send({ description: 'No name here' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when name is empty string', async () => {
    const res = await request
      .post('/api/projects')
      .set(authHeader(ownerToken))
      .send({ name: '', description: 'Empty name' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when name exceeds 100 characters', async () => {
    const res = await request
      .post('/api/projects')
      .set(authHeader(ownerToken))
      .send({ name: 'x'.repeat(101) });

    expect(res.status).toBe(400);
  });

  it('returns 400 when description exceeds 500 characters', async () => {
    const res = await request
      .post('/api/projects')
      .set(authHeader(ownerToken))
      .send({ name: 'Long Desc', description: 'x'.repeat(501) });

    expect(res.status).toBe(400);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request
      .post('/api/projects')
      .send({ name: 'Unauth Project' });

    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /api/projects — list projects
// ---------------------------------------------------------------------------

describe('GET /api/projects', () => {
  let sharedProject;

  beforeAll(async () => {
    sharedProject = await createTestProject(request, ownerToken, {
      name: 'Shared Project',
    });
    await request
      .post(`/api/projects/${sharedProject.id}/members`)
      .set(authHeader(ownerToken))
      .send({ email: 'member@projects.test' });
  });

  it('returns 200 with array of projects (AC-2.2)', async () => {
    const res = await request.get('/api/projects').set(authHeader(ownerToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('includes projects the user owns (AC-2.2)', async () => {
    const res = await request.get('/api/projects').set(authHeader(ownerToken));
    const names = res.body.map((p) => p.name);
    expect(names).toContain('Shared Project');
  });

  it('includes projects the user is a member of (AC-2.2)', async () => {
    const res = await request.get('/api/projects').set(authHeader(memberToken));

    expect(res.status).toBe(200);
    const names = res.body.map((p) => p.name);
    expect(names).toContain('Shared Project');
  });

  it('does NOT include projects the user has no access to (AC-2.6)', async () => {
    const res = await request.get('/api/projects').set(authHeader(outsiderToken));

    expect(res.status).toBe(200);
    const names = res.body.map((p) => p.name);
    expect(names).not.toContain('Shared Project');
  });

  it('returns member_count and task_count fields (AC-2.2)', async () => {
    const res = await request.get('/api/projects').set(authHeader(ownerToken));
    const proj = res.body.find((p) => p.id === sharedProject.id);
    expect(proj).toHaveProperty('member_count');
    expect(proj).toHaveProperty('task_count');
    expect(proj.member_count).toBeGreaterThanOrEqual(2);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request.get('/api/projects');
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /api/projects/:id — get project by ID
// ---------------------------------------------------------------------------

describe('GET /api/projects/:id', () => {
  let project;

  beforeAll(async () => {
    project = await createTestProject(request, ownerToken, { name: 'Detail Project' });
  });

  it('returns 200 with project detail for a member (AC-2.3)', async () => {
    const res = await request
      .get(`/api/projects/${project.id}`)
      .set(authHeader(ownerToken));

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(project.id);
    expect(res.body.name).toBe('Detail Project');
    expect(Array.isArray(res.body.members)).toBe(true);
    expect(res.body).toHaveProperty('task_counts');
  });

  it('task_counts has the four Kanban status keys', async () => {
    const res = await request
      .get(`/api/projects/${project.id}`)
      .set(authHeader(ownerToken));

    const { task_counts } = res.body;
    expect(task_counts).toHaveProperty('todo');
    expect(task_counts).toHaveProperty('in_progress');
    expect(task_counts).toHaveProperty('review');
    expect(task_counts).toHaveProperty('done');
  });

  it('returns 403 for a user who is not a project member (AC-2.6)', async () => {
    const res = await request
      .get(`/api/projects/${project.id}`)
      .set(authHeader(outsiderToken));

    expect(res.status).toBe(403);
  });

  it('returns 404 for a non-existent project ID', async () => {
    const res = await request
      .get('/api/projects/999999')
      .set(authHeader(ownerToken));

    expect(res.status).toBe(404);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request.get(`/api/projects/${project.id}`);
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/projects/:id — update project
// ---------------------------------------------------------------------------

describe('PUT /api/projects/:id', () => {
  let project;

  beforeAll(async () => {
    project = await createTestProject(request, ownerToken, { name: 'Update Target' });
    await request
      .post(`/api/projects/${project.id}/members`)
      .set(authHeader(ownerToken))
      .send({ email: 'member@projects.test' });
  });

  it('owner can update project name (AC-2.4)', async () => {
    const res = await request
      .put(`/api/projects/${project.id}`)
      .set(authHeader(ownerToken))
      .send({ name: 'Updated Name' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  it('owner can update project description (AC-2.4)', async () => {
    const res = await request
      .put(`/api/projects/${project.id}`)
      .set(authHeader(ownerToken))
      .send({ description: 'New description text' });

    expect(res.status).toBe(200);
    expect(res.body.description).toBe('New description text');
  });

  it('returns 403 when a non-owner member tries to update (AC-2.4)', async () => {
    const res = await request
      .put(`/api/projects/${project.id}`)
      .set(authHeader(memberToken))
      .send({ name: 'Member Attempt' });

    expect(res.status).toBe(403);
  });

  it('returns 403 when an outsider tries to update (AC-2.6)', async () => {
    const res = await request
      .put(`/api/projects/${project.id}`)
      .set(authHeader(outsiderToken))
      .send({ name: 'Outsider Attempt' });

    expect(res.status).toBe(403);
  });

  it('returns 400 when neither name nor description is provided', async () => {
    const res = await request
      .put(`/api/projects/${project.id}`)
      .set(authHeader(ownerToken))
      .send({});

    expect(res.status).toBe(400);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request
      .put(`/api/projects/${project.id}`)
      .send({ name: 'Unauth Update' });
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/projects/:id — delete project
// ---------------------------------------------------------------------------

describe('DELETE /api/projects/:id', () => {
  it('owner can delete their project (AC-2.5)', async () => {
    const project = await createTestProject(request, ownerToken, { name: 'To Be Deleted' });

    const res = await request
      .delete(`/api/projects/${project.id}`)
      .set(authHeader(ownerToken));

    expect(res.status).toBe(204);

    const check = await request
      .get(`/api/projects/${project.id}`)
      .set(authHeader(ownerToken));
    expect(check.status).toBe(404);
  });

  it('returns 403 when a non-owner member tries to delete', async () => {
    const project = await createTestProject(request, ownerToken, { name: 'Protected Project' });

    await request
      .post(`/api/projects/${project.id}/members`)
      .set(authHeader(ownerToken))
      .send({ email: 'member@projects.test' });

    const res = await request
      .delete(`/api/projects/${project.id}`)
      .set(authHeader(memberToken));

    expect(res.status).toBe(403);
  });

  it('returns 403 when an outsider tries to delete (AC-2.6)', async () => {
    const project = await createTestProject(request, ownerToken, { name: 'Safe Project' });

    const res = await request
      .delete(`/api/projects/${project.id}`)
      .set(authHeader(outsiderToken));

    expect(res.status).toBe(403);
  });

  it('returns 401 when unauthenticated', async () => {
    const project = await createTestProject(request, ownerToken, { name: 'Unauth Delete' });
    const res = await request.delete(`/api/projects/${project.id}`);
    expect(res.status).toBe(401);
  });
});
