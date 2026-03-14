const request = require('supertest');
const app = require('../src/app');

describe('AUTH ENDPOINTS', () => {

  describe('POST /api/auth/register', () => {
    it('doit créer un compte avec données valides', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .set('Authorization', 'Bearer MOCK_TOKEN')
        .send({
          uid: 'test-uid-123',
          name: 'Test User',
          email: 'test@moneyflow.com',
          phone: '+226 70 00 00 00',
          operator: 'wave'
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('uid');
      expect(res.body.user).toHaveProperty('name', 'Test User');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('doit retourner 401 sans token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test@test.com' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('doit retourner 401 sans token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/health', () => {
    it('doit retourner status OK', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
