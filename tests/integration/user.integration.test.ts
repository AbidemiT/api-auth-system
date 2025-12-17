import request from 'supertest';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../src/config';

import { createTestApp } from '../helpers/app';
import { setTestDB, tearDownTestDB, createTestUser } from '../setup';

const app = createTestApp();

describe('Auth Integration Tests', () => {
  let testUserId: string;
  let validToken: string;

  beforeAll(async () => {
    await setTestDB();
  });

  afterAll(async () => {
    await tearDownTestDB();
  });

  beforeEach(async () => {
    await setTestDB();

    // Create a test user before each test
    const user = await createTestUser('usertest@example.com');
    testUserId = user.id;

    validToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET as string,
      { expiresIn: '7d' }
    );
  });

  describe('GET /api/v1/user/profile', () => {
    it('should get user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/user/profile')
        .set('Authorization', `Bearer ${validToken}`);

      console.log({ response: res });


      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('id', testUserId);
      expect(res.body.data).toHaveProperty('email', 'usertest@example.com');
      expect(res.body.data).toHaveProperty('name', 'Test User');
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should fail to get profile with invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/user/profile')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.status).toBe(403);
      expect(res.body.success).toBe('false');
    });

    it('should fail to get profile without token', async () => {
      const res = await request(app)
        .get('/api/v1/user/profile');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe('false');
    });
  });

  it('should fail with malformed Authorization header', async () => {
    const res = await request(app)
      .get('/api/v1/user/profile')
      .set('Authorization', 'MalformedHeader');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe('false');
  });

});