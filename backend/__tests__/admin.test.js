const request = require('supertest');
const app = require('../src/app');

describe('ADMIN ENDPOINTS', () => {

  it('GET /api/admin/users → 401 sans token', async () => {
    const res = await request(app)
      .get('/api/admin/users');
    expect(res.status).toBe(401);
  });

  it('GET /api/admin/stats → 401 sans token', async () => {
    const res = await request(app)
      .get('/api/admin/stats');
    expect(res.status).toBe(401);
  });

  it('DELETE /api/admin/users/:uid → 401 sans token', 
    async () => {
    const res = await request(app)
      .delete('/api/admin/users/fake-uid');
    expect(res.status).toBe(401);
  });
});
