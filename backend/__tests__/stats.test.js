const request = require('supertest');
const app = require('../src/app');

describe('STATS ENDPOINTS', () => {

  it('GET /api/stats/summary → 401 sans token', async () => {
    const res = await request(app)
      .get('/api/stats/summary');
    expect(res.status).toBe(401);
  });

  it('GET /api/stats/monthly → 401 sans token', async () => {
    const res = await request(app)
      .get('/api/stats/monthly');
    expect(res.status).toBe(401);
  });

  it('GET /api/stats/categories → 401 sans token', async () => {
    const res = await request(app)
      .get('/api/stats/categories');
    expect(res.status).toBe(401);
  });

  it('GET /api/stats/daily → 401 sans token', async () => {
    const res = await request(app)
      .get('/api/stats/daily');
    expect(res.status).toBe(401);
  });
});
