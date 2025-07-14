/** @jest-environment node */
const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { DataSource } = require('typeorm');
const Consultant = require('./entity/Consultant');
const Client = require('./entity/Client');

let app;
let dataSource;

beforeAll(async () => {
  dataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    entities: [Consultant, Client],
  });
  await dataSource.initialize();

  app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/consultants', async (req, res) => {
    const repository = dataSource.getRepository('Consultant');
    const { status, search, limit, page = 1 } = req.query;

    let query = repository.createQueryBuilder('c');
    if (status) query = query.where('c.status = :status', { status });
    if (search) {
      const s = `%${search.toLowerCase()}%`;
      query = query.andWhere('(LOWER(c.firstName) LIKE :s OR LOWER(c.lastName) LIKE :s)', { s });
    }
    if (limit) {
      const l = parseInt(limit, 10);
      const p = parseInt(page, 10) || 1;
      query = query.skip((p - 1) * l).take(l);
    }
    const result = await query.getMany();
    res.json(result);
  });

  app.get('/api/clients', async (req, res) => {
    const repository = dataSource.getRepository('Client');
    const { limit, page = 1 } = req.query;
    let query = repository.createQueryBuilder('c');
    if (limit) {
      const l = parseInt(limit, 10);
      const p = parseInt(page, 10) || 1;
      query = query.skip((p - 1) * l).take(l);
    }
    const result = await query.getMany();
    res.json(result);
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

beforeEach(async () => {
  const consultantRepo = dataSource.getRepository('Consultant');
  await consultantRepo.clear();
  await consultantRepo.save({
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'Dev',
    status: 'assigned',
    experience: 5,
  });

  const clientRepo = dataSource.getRepository('Client');
  await clientRepo.clear();
  await clientRepo.save({
    name: 'TechSolutions SA',
    type: 'enterprise',
    sector: 'Finance & Assurance',
    contactName: 'Jean Dupont',
    contactEmail: 'j.dupont@techsolutions.fr',
    contactPhone: '+33 1 23 45 67 89',
    website: 'www.techsolutions.fr',
    address: '25 Avenue des Champs-Élysées',
    city: 'Paris',
    postalCode: '75008',
    country: 'France',
    notes: 'Client important',
    status: 'actif',
    createdAt: new Date('2022-06-15T10:00:00Z'),
  });
});

describe('GET /api/consultants', () => {
  it('returns list of consultants', async () => {
    const res = await request(app).get('/api/consultants');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].firstName).toBe('Jean');
  });

  it('filters by status', async () => {
    const repo = dataSource.getRepository('Consultant');
    await repo.save({
      firstName: 'Alice',
      lastName: 'Lemoine',
      role: 'Dev',
      status: 'available',
      experience: 3,
    });

    const res = await request(app)
      .get('/api/consultants')
      .query({ status: 'available' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].firstName).toBe('Alice');
  });

  it('supports pagination', async () => {
    const repo = dataSource.getRepository('Consultant');
    for (let i = 0; i < 10; i++) {
      await repo.save({
        firstName: `Test${i}`,
        lastName: 'User',
        role: 'Dev',
        status: 'assigned',
        experience: i,
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

describe('GET /api/clients', () => {
  it('returns list of clients', async () => {
    const res = await request(app).get('/api/clients');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe('TechSolutions SA');
  });

  it('supports pagination', async () => {
    const repo = dataSource.getRepository('Client');
    for (let i = 0; i < 5; i++) {
      await repo.save({
        name: `Client${i}`,
        type: 'enterprise',
        sector: 'IT',
        status: 'actif',
        createdAt: new Date(),
      });
    }

    const res = await request(app)
      .get('/api/clients')
      .query({ limit: 3, page: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body[0].name).toBe('Client2');
  });
});
