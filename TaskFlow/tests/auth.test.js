/**
 * auth.test.js
 * Tests for POST /api/auth/signup and POST /api/auth/login.
 * Covers AC-1.1 through AC-1.7 from the PRD.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestApp, teardownTestApp } from './test-helpers.js';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Use createRequire rooted at the API source so that jsonwebtoken resolves
// from the API's own node_modules, not the tests' node_modules.
const require = createRequire(path.resolve(__dirname, '../src/api/server.js'));

let request;
let tmpDb;

beforeAll(() => {
  const setup = setupTestApp();
  request = setup.request;
  tmpDb = setup.tmpDb;
});

afterAll(() => {
  teardownTestApp(tmpDb);
});

// ---------------------------------------------------------------------------
// POST /api/auth/signup
// ---------------------------------------------------------------------------

describe('POST /api/auth/signup', () => {
  it('returns 201 with user object and JWT token when given valid data (AC-1.1)', async () => {
    const payload = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'SecurePass1',
    };

    const res = await request.post('/api/auth/signup').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(payload.email);
    expect(res.body.user.name).toBe(payload.name);
    // password_hash must NOT be exposed
    expect(res.body.user).not.toHaveProperty('password_hash');
    // Token should be a non-empty string
    expect(typeof res.body.token).toBe('string');
    expect(res.body.token.length).toBeGreaterThan(10);
  });

  it('returns 409 Conflict when email is already registered (AC-1.2)', async () => {
    const payload = {
      name: 'Duplicate User',
      email: 'duplicate@example.com',
      password: 'Password1',
    };

    await request.post('/api/auth/signup').send(payload);
    const res = await request.post('/api/auth/signup').send(payload);

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('returns 400 when email format is invalid (AC-1.3)', async () => {
    const res = await request.post('/api/auth/signup').send({
      name: 'Bad Email User',
      email: 'not-an-email',
      password: 'Password1',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when password is shorter than 8 characters (AC-1.3)', async () => {
    const res = await request.post('/api/auth/signup').send({
      name: 'Short Pass User',
      email: 'shortpass@example.com',
      password: 'Ab1',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when password has no number', async () => {
    const res = await request.post('/api/auth/signup').send({
      name: 'No Number User',
      email: 'nonumber@example.com',
      password: 'PasswordOnly',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when password has no letter', async () => {
    const res = await request.post('/api/auth/signup').send({
      name: 'No Letter User',
      email: 'noletter@example.com',
      password: '12345678',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when name is missing', async () => {
    const res = await request.post('/api/auth/signup').send({
      email: 'noname@example.com',
      password: 'Password1',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when email is missing', async () => {
    const res = await request.post('/api/auth/signup').send({
      name: 'No Email',
      password: 'Password1',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('stores user so a subsequent login with those credentials succeeds', async () => {
    const email = 'persistent@example.com';
    const password = 'Persist99';

    await request.post('/api/auth/signup').send({ name: 'Persist User', email, password });

    const loginRes = await request.post('/api/auth/login').send({ email, password });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.user.email).toBe(email);
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------

describe('POST /api/auth/login', () => {
  const userEmail = 'login.tester@example.com';
  const userPassword = 'LoginTest1';

  beforeAll(async () => {
    await request.post('/api/auth/signup').send({
      name: 'Login Tester',
      email: userEmail,
      password: userPassword,
    });
  });

  it('returns 200 with token when credentials are correct (AC-1.4)', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ email: userEmail, password: userPassword });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(userEmail);
    expect(res.body.user).not.toHaveProperty('password_hash');
    // Token must be a valid-looking JWT (3 base64url segments)
    expect(res.body.token.split('.').length).toBe(3);
  });

  it('returns 401 with wrong password (AC-1.5)', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ email: userEmail, password: 'WrongPassword9' });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('does not reveal whether email or password is wrong in the error message (AC-1.5)', async () => {
    const wrongPassRes = await request
      .post('/api/auth/login')
      .send({ email: userEmail, password: 'WrongPassword9' });

    const noEmailRes = await request
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'WrongPassword9' });

    // Both should return the same generic message
    expect(wrongPassRes.body.error.message).toBe(noEmailRes.body.error.message);
  });

  it('returns 401 when email does not exist (AC-1.5)', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ email: 'ghost@example.com', password: 'Password1' });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('returns 400 when email field is missing', async () => {
    const res = await request.post('/api/auth/login').send({ password: 'Password1' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when password field is missing', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ email: userEmail });
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// Protected route access (AC-1.6 / AC-1.7)
// ---------------------------------------------------------------------------

describe('Protected route access', () => {
  it('returns 401 when no Authorization header is sent (AC-1.6)', async () => {
    const res = await request.get('/api/projects');
    expect(res.status).toBe(401);
  });

  it('returns 401 when Authorization header has wrong scheme', async () => {
    const res = await request
      .get('/api/projects')
      .set('Authorization', 'Basic sometoken');
    expect(res.status).toBe(401);
  });

  it('returns 401 when token is a garbage string (AC-1.6)', async () => {
    const res = await request
      .get('/api/projects')
      .set('Authorization', 'Bearer not.a.valid.token');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('returns 401 when token is signed with a wrong secret (AC-1.7)', async () => {
    const jwt = require('jsonwebtoken');
    const badToken = jwt.sign({ userId: 1, email: 'x@x.com' }, 'wrong-secret', { expiresIn: '1h' });

    const res = await request
      .get('/api/projects')
      .set('Authorization', `Bearer ${badToken}`);

    expect(res.status).toBe(401);
  });

  it('returns 401 when token is expired (AC-1.7)', async () => {
    const jwt = require('jsonwebtoken');
    const expiredToken = jwt.sign(
      { userId: 1, email: 'x@x.com' },
      'test-secret-key',
      { expiresIn: '-1s' } // already expired
    );

    const res = await request
      .get('/api/projects')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
  });

  it('can access protected route with a valid token', async () => {
    const signupRes = await request.post('/api/auth/signup').send({
      name: 'Auth Checker',
      email: 'authchecker@example.com',
      password: 'Checker1',
    });
    const { token } = signupRes.body;

    const res = await request
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
