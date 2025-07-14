const dataSource = require('./data-source');
const Consultant = require('./entity/Consultant');
const Client = require('./entity/Client');

dataSource.initialize().then(async () => {
  const consultantRepo = dataSource.getRepository('Consultant');
  const consultantCount = await consultantRepo.count();
  if (consultantCount === 0) {
    const consultant = consultantRepo.create({
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'Développeur Full Stack',
      status: 'assigned',
      experience: 5,
    });
    await consultantRepo.save(consultant);
  }

  const clientRepo = dataSource.getRepository('Client');
  const clientCount = await clientRepo.count();
  if (clientCount === 0) {
    const client = clientRepo.create({
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
      notes: 'Client important avec plusieurs projets stratégiques.',
      status: 'actif',
      createdAt: new Date('2022-06-15T10:00:00Z'),
    });
    await clientRepo.save(client);
  }
  console.log('Database seeded');
  await dataSource.destroy();
}).catch(err => {
  console.error('Seed failed', err);
});
