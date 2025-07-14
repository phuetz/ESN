/** @jest-environment node */
const request = require('supertest');
const express = require('express');
const cors = require('cors');

// setup minimal app similar to index.js
const app = express();
app.use(cors());
app.use(express.json());
let consultants = [{ id: 1, firstName: 'Jean', lastName: 'Dupont', role: 'Dev', status: 'assigned', experience: 5 }];
app.get('/api/consultants', (req, res) => res.json(consultants));


describe('GET /api/consultants', () => {
  it('returns list of consultants', async () => {
    const res = await request(app).get('/api/consultants');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].firstName).toBe('Jean');
  });
});
