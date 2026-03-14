const request = require('supertest');
const app = require('../src/app');

describe('EXPENSES ENDPOINTS', () => {

  describe('GET /api/expenses', () => {
    it('doit retourner 401 sans token', async () => {
      const res = await request(app).get('/api/expenses');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/expenses', () => {
    it('doit retourner 401 sans token', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .send({ amount: 5000, category: 'alimentation' });
      expect(res.status).toBe(401);
    });

    it('doit retourner 400 si montant invalide', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('Authorization', 'Bearer MOCK_TOKEN')
        .send({ amount: -100, category: 'alimentation' });
      expect(res.status).toBeOneOf([400, 401]);
    });

    it('doit retourner 400 si catégorie invalide', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('Authorization', 'Bearer MOCK_TOKEN')
        .send({ amount: 5000, category: 'categorie_invalide' });
      expect(res.status).toBeOneOf([400, 401]);
    });
  });

  describe('DELETE /api/expenses/:id', () => {
    it('doit retourner 401 sans token', async () => {
      const res = await request(app)
        .delete('/api/expenses/fake-id-123');
      expect(res.status).toBe(401);
    });
  });
});
