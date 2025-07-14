const express = require('express');
const cors = require('cors');
const dataSource = require('./data-source');
const Consultant = require('./entity/Consultant');
const Client = require('./entity/Client');
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/consultants', async (req, res) => {
  const repository = dataSource.getRepository('Consultant');
  const { status, search, limit, page = 1 } = req.query;

  const where = {};
  if (status) where.status = status;
  if (search) {
    const s = `%${search.toLowerCase()}%`;
    where.firstName = where.lastName = undefined; // placeholder to use query builder
  }

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

app.post('/api/consultants', async (req, res) => {
  const repository = dataSource.getRepository('Consultant');
  const consultant = repository.create(req.body);
  const saved = await repository.save(consultant);
  res.status(201).json(saved);
});

app.put('/api/consultants/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const repository = dataSource.getRepository('Consultant');
  const consultant = await repository.findOneBy({ id });
  if (!consultant) return res.status(404).send();
  repository.merge(consultant, req.body);
  const saved = await repository.save(consultant);
  res.json(saved);
});

app.delete('/api/consultants/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const repository = dataSource.getRepository('Consultant');
  await repository.delete({ id });
  res.status(204).send();
});


// -------------------- Clients endpoints --------------------
app.get('/api/clients', async (req, res) => {
  const repository = dataSource.getRepository('Client');
  const clients = await repository.find();
  res.json(clients);
});

app.post('/api/clients', async (req, res) => {
  const repository = dataSource.getRepository('Client');
  const client = repository.create(req.body);
  const saved = await repository.save(client);
  res.status(201).json(saved);
});

app.put('/api/clients/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const repository = dataSource.getRepository('Client');
  const client = await repository.findOneBy({ id });
  if (!client) return res.status(404).send();
  repository.merge(client, req.body);
  const saved = await repository.save(client);
  res.json(saved);
});

app.delete('/api/clients/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const repository = dataSource.getRepository('Client');
  await repository.delete({ id });
  res.status(204).send();
});

dataSource
  .initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database', err);
  });
