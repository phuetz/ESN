/** @jest-environment node */
const request = require('supertest');
const express = require('express');
const cors = require('cors');

// setup minimal app similar to index.js
const app = express();
app.use(cors());
app.use(express.json());

let consultants;

app.get('/api/consultants', (req, res) => {
  let result = consultants;
  const { status, search, limit, page = 1 } = req.query;

  if (status) {
    result = result.filter(c => c.status === status);
  }

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      c =>
        c.firstName.toLowerCase().includes(s) ||
        c.lastName.toLowerCase().includes(s)
    );
  }

  if (limit) {
    const l = parseInt(limit, 10);
    const p = parseInt(page, 10) || 1;
    result = result.slice((p - 1) * l, p * l);
  }

  res.json(result);
});

beforeEach(() => {
  consultants = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'Dev',
      status: 'assigned',
      experience: 5
    }
  ];
});


describe('GET /api/consultants', () => {
  it('returns list of consultants', async () => {
    const res = await request(app).get('/api/consultants');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].firstName).toBe('Jean');
  });

  it('filters by status', async () => {
    consultants.push({
      id: 2,
      firstName: 'Alice',
      lastName: 'Lemoine',
      role: 'Dev',
      status: 'available',
      experience: 3
    });

    const res = await request(app)
      .get('/api/consultants')
      .query({ status: 'available' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].firstName).toBe('Alice');
  });

  it('supports pagination', async () => {
    for (let i = 0; i < 10; i++) {
      consultants.push({
        id: i + 2,
        firstName: `Test${i}`,
        lastName: 'User',
        role: 'Dev',
        status: 'assigned',
        experience: i
      });
    }

    const res = await request(app)
      .get('/api/consultants')
      .query({ limit: 5, page: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(5);
    expect(res.body[0].firstName).toBe('Test4');
  });
});
