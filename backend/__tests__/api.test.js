const request = require('supertest');
const app = require('./test-server');

describe('API ENDPOINTS TESTS', () => {

  describe('HEALTH', () => {
    it('GET /api/health → 200 OK', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('API Health OK');
    });
  });

  describe('AUTH ENDPOINTS', () => {
    it('GET /api/auth/me → 401 sans token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/auth/me → 200 avec token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer VALID_TOKEN');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('uid');
    });

    it('POST /api/auth/register → 401 sans token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test@test.com' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/auth/register → 200 avec token et données valides', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .set('Authorization', 'Bearer VALID_TOKEN')
        .send({
          uid: 'test-uid-123',
          name: 'Test User',
          email: 'test@moneyflow.com',
          phone: '+226 70 00 00 00',
          operator: 'wave'
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('name', 'Test User');
    });
  });

  describe('EXPENSES ENDPOINTS', () => {
    it('GET /api/expenses → 401 sans token', async () => {
      const res = await request(app).get('/api/expenses');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/expenses → 200 avec token', async () => {
      const res = await request(app)
        .get('/api/expenses')
        .set('Authorization', 'Bearer VALID_TOKEN');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.expenses)).toBe(true);
    });

    it('POST /api/expenses → 401 sans token', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .send({ amount: 5000, category: 'alimentation' });
      expect(res.status).toBe(401);
    });

    it('POST /api/expenses → 400 si montant invalide', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('Authorization', 'Bearer VALID_TOKEN')
        .send({ amount: -100, category: 'alimentation' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/expenses → 400 si catégorie manquante', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('Authorization', 'Bearer VALID_TOKEN')
        .send({ amount: 5000 });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/expenses → 201 avec données valides', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('Authorization', 'Bearer VALID_TOKEN')
        .send({ amount: 5000, category: 'alimentation' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.expense).toHaveProperty('amount', 5000);
    });

    it('DELETE /api/expenses/:id → 401 sans token', async () => {
      const res = await request(app)
        .delete('/api/expenses/fake-id-123');
      expect(res.status).toBe(401);
    });

    it('DELETE /api/expenses/:id → 200 avec token', async () => {
      const res = await request(app)
        .delete('/api/expenses/fake-id-123')
        .set('Authorization', 'Bearer VALID_TOKEN');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('BUDGETS ENDPOINTS', () => {
    it('GET /api/budgets → 401 sans token', async () => {
      const res = await request(app).get('/api/budgets');
      expect(res.status).toBe(401);
    });

    it('GET /api/budgets → 200 avec token', async () => {
      const res = await request(app)
        .get('/api/budgets')
        .set('Authorization', 'Bearer VALID_TOKEN');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.budgets)).toBe(true);
    });
  });

  describe('STATS ENDPOINTS', () => {
    it('GET /api/stats/summary → 401 sans token', async () => {
      const res = await request(app)
        .get('/api/stats/summary');
      expect(res.status).toBe(401);
    });

    it('GET /api/stats/summary → 200 avec token', async () => {
      const res = await request(app)
        .get('/api/stats/summary')
        .set('Authorization', 'Bearer VALID_TOKEN');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats).toHaveProperty('totalExpenses');
      expect(res.body.stats).toHaveProperty('totalRevenues');
    });
  });

  describe('ROUTE NON TROUVÉE', () => {
    it('GET /api/inexistant → 404', async () => {
      const res = await request(app).get('/api/inexistant');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

});
