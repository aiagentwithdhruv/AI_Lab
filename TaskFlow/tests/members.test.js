/**
 * members.test.js
 * Tests for Team Management endpoints.
 * Covers AC-5.1 through AC-5.6 from the PRD.
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
let owner;
let ownerToken;
let registered;
let registeredToken;
let outsider;
let outsiderToken;
let project;

beforeAll(async () => {
  const setup = setupTestApp();
  request = setup.request;
  tmpDb = setup.tmpDb;

  ({ user: owner, token: ownerToken } = await createTestUser(request, {
    name: 'Members Owner',
    email: 'membersowner@members.test',
    password: 'OwnerPass1',
  }));

  ({ user: registered, token: registeredToken } = await createTestUser(request, {
    name: 'Registered User',
    email: 'registered@members.test',
    password: 'Registered1',
  }));

  ({ user: outsider, token: outsiderToken } = await createTestUser(request, {
    name: 'Outsider User',
    email: 'outsider@members.test',
    password: 'Outsider11',
  }));

  project = await createTestProject(request, ownerToken, { name: 'Members Test Project' });
});

afterAll(() => teardownTestApp(tmpDb));

const memberBase = () => `/api/projects/${project.id}/members`;

// ---------------------------------------------------------------------------
// POST /api/projects/:projectId/members — invite member
// ---------------------------------------------------------------------------

describe('POST /api/projects/:projectId/members (invite)', () => {
  it('owner can invite a registered user by email and gets 201 (AC-5.1)', async () => {
    const res = await request
      .post(memberBase())
      .set(authHeader(ownerToken))
      .send({ email: 'registered@members.test' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user_id', registered.id);
    expect(res.body.email).toBe('registered@members.test');
    expect(res.body.role).toBe('member');
  });

  it('returns 409 when inviting a user who is already a member (AC-5.3)', async () => {
    const res = await request
      .post(memberBase())
      .set(authHeader(ownerToken))
      .send({ email: 'registered@members.test' });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('returns 404 when inviting an email that has no account (AC-5.2)', async () => {
    const res = await request
      .post(memberBase())
      .set(authHeader(ownerToken))
      .send({ email: 'nobody_never_registered@members.test' });

    expect(res.status).toBe(404);
  });

  it('returns 403 when a non-owner member tries to invite (AC-5.6)', async () => {
    // registered is now a member but not the owner
    await createTestUser(request, {
      name: 'Another Person',
      email: 'another@members.test',
      password: 'Another111',
    });

    const res = await request
      .post(memberBase())
      .set(authHeader(registeredToken))
      .send({ email: 'another@members.test' });

    expect(res.status).toBe(403);
  });

  it('returns 403 when an outsider tries to invite', async () => {
    const res = await request
      .post(memberBase())
      .set(authHeader(outsiderToken))
      .send({ email: 'registered@members.test' });

    expect(res.status).toBe(403);
  });

  it('returns 400 when email field is missing', async () => {
    const res = await request
      .post(memberBase())
      .set(authHeader(ownerToken))
      .send({});

    expect(res.status).toBe(400);
  });

  it('returns 400 when email format is invalid', async () => {
    const res = await request
      .post(memberBase())
      .set(authHeader(ownerToken))
      .send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request
      .post(memberBase())
      .send({ email: 'registered@members.test' });

    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /api/projects/:projectId/members — list members
// ---------------------------------------------------------------------------

describe('GET /api/projects/:projectId/members', () => {
  it('returns 200 with array of members (AC-5.1)', async () => {
    const res = await request
      .get(memberBase())
      .set(authHeader(ownerToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('each member entry has required fields', async () => {
    const res = await request
      .get(memberBase())
      .set(authHeader(ownerToken));

    for (const m of res.body) {
      expect(m).toHaveProperty('user_id');
      expect(m).toHaveProperty('name');
      expect(m).toHaveProperty('email');
      expect(m).toHaveProperty('role');
      expect(m).toHaveProperty('joined_at');
    }
  });

  it('owner appears in the member list', async () => {
    const res = await request
      .get(memberBase())
      .set(authHeader(ownerToken));

    const ownerEntry = res.body.find((m) => m.user_id === owner.id);
    expect(ownerEntry).toBeDefined();
    expect(ownerEntry.role).toBe('owner');
  });

  it('returns 403 when an outsider requests member list (AC-2.6)', async () => {
    const res = await request
      .get(memberBase())
      .set(authHeader(outsiderToken));

    expect(res.status).toBe(403);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request.get(memberBase());
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/projects/:projectId/members/:userId — remove member
// ---------------------------------------------------------------------------

describe('DELETE /api/projects/:projectId/members/:userId', () => {
  let extraMember;
  let extraMemberToken;

  beforeAll(async () => {
    ({ user: extraMember, token: extraMemberToken } = await createTestUser(request, {
      name: 'Extra Member',
      email: 'extra@members.test',
      password: 'ExtraMember1',
    }));

    await request
      .post(memberBase())
      .set(authHeader(ownerToken))
      .send({ email: 'extra@members.test' });
  });

  it('owner can remove a member and gets 204 (AC-5.4)', async () => {
    const res = await request
      .delete(`${memberBase()}/${extraMember.id}`)
      .set(authHeader(ownerToken));

    expect(res.status).toBe(204);
  });

  it('removed member can no longer access the project (AC-5.4)', async () => {
    const res = await request
      .get(`/api/projects/${project.id}`)
      .set(authHeader(extraMemberToken));

    expect(res.status).toBe(403);
  });

  it('owner cannot remove themselves (AC-5.5)', async () => {
    const res = await request
      .delete(`${memberBase()}/${owner.id}`)
      .set(authHeader(ownerToken));

    expect(res.status).toBe(400);
  });

  it('returns 403 when a non-owner member tries to remove someone (AC-5.6)', async () => {
    const { user: victim } = await createTestUser(request, {
      name: 'Victim',
      email: 'victim@members.test',
      password: 'Victim1111',
    });
    await request
      .post(memberBase())
      .set(authHeader(ownerToken))
      .send({ email: 'victim@members.test' });

    const res = await request
      .delete(`${memberBase()}/${victim.id}`)
      .set(authHeader(registeredToken));

    expect(res.status).toBe(403);
  });

  it('returns 403 when an outsider tries to remove a member (AC-2.6)', async () => {
    const res = await request
      .delete(`${memberBase()}/${registered.id}`)
      .set(authHeader(outsiderToken));

    expect(res.status).toBe(403);
  });

  it('returns 404 when removing a user who is not a member', async () => {
    const res = await request
      .delete(`${memberBase()}/${outsider.id}`)
      .set(authHeader(ownerToken));

    expect(res.status).toBe(404);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request.delete(`${memberBase()}/${registered.id}`);
    expect(res.status).toBe(401);
  });
});
