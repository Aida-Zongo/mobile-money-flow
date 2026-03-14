const request = require('supertest');
const app = require('../src/app');

describe('BUDGETS ENDPOINTS', () => {

  describe('GET /api/budgets', () => {
    it('doit retourner 401 sans token', async () => {
      const res = await request(app).get('/api/budgets');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/budgets/status', () => {
    it('doit retourner 401 sans token', async () => {
      const res = await request(app)
        .get('/api/budgets/status');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/budgets', () => {
    it('doit retourner 401 sans token', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .send({ 
          category: 'alimentation',
          limitAmount: 50000,
          month: 3,
          year: 2026
        });
      expect(res.status).toBe(401);
    });
  });
});
