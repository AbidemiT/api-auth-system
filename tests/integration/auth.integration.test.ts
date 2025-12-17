// Auth integration tests will go here

import request from 'supertest';
import { createTestApp } from '../helpers/app';
import { setTestDB, tearDownTestDB, createTestUser } from '../setup';

const app = createTestApp();

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await setTestDB();
  });

  afterAll(async () => {
    await tearDownTestDB();
  });

  beforeEach(async () => {
    await setTestDB();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.data.user).not.toHaveProperty('password');
      expect(res.body.data.user).toHaveProperty('name', 'Test User');
      expect(res.body.data.token).toBeDefined();
    });

    it('should fail invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
          name: 'Test User',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should fail short and weak password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'short!',
          name: 'Test User',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should fail without required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe('false');
    });

    it('should not register user with existing email', async () => {
      // Create initial user
      await createTestUser('duplicate@example.com');
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Password123!',
          name: 'Test User',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe('false');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await createTestUser('test@example.com');
    });

    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', 'test@example.com');
    });

    it('should fail login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe('false');
    });

    it('should fail login with non-existing email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe('false');
    });

    it('should fail login with missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: '',
          password: '',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe('false');
    });

    it('should fail login with invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid-email',
          password: 'Password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe('false');
    });
  });
});