const request = require('supertest');
require('dotenv').config();

const API = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;
const headers = { Authorization: `Bearer ${TOKEN}` };

describe('Product Inventory API Tests', () => {
  test('GET /api/products - should list all products', async () => {
    const res = await request(API).get('/api/products').set(headers);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/products/:id - invalid ID returns 404', async () => {
    const res = await request(API).get('/api/products/9999999').set(headers);
    expect(res.statusCode).toBe(404);
  });

  test('POST /api/products - missing fields returns error', async () => {
    const res = await request(API)
      .post('/api/products')
      .set(headers)
      .send({ name: "" });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test('POST /api/products - valid data creates product', async () => {
    const res = await request(API)
      .post('/api/products')
      .set(headers)
      .send({
        name: "Test Product",
        description: "Sample",
        price: 100,
        quantity: 1
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('Rate Limit Check - 5 quick calls do not fail', async () => {
    const calls = [...Array(5)].map(() =>
      request(API).get('/api/products').set(headers)
    );
    const responses = await Promise.all(calls);
    responses.forEach(res => expect(res.statusCode).toBe(200));
  });
});