const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let consultants = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'Développeur Full Stack',
    status: 'assigned',
    experience: 5
  }
];

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

app.post('/api/consultants', (req, res) => {
  const consultant = req.body;
  consultant.id = consultants.length + 1;
  consultants.push(consultant);
  res.status(201).json(consultant);
});

app.put('/api/consultants/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = consultants.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).send();
  consultants[index] = { ...consultants[index], ...req.body };
  res.json(consultants[index]);
});

app.delete('/api/consultants/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  consultants = consultants.filter(c => c.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
