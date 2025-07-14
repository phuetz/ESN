const dataSource = require('./data-source');
const Consultant = require('./entity/Consultant');
const Client = require("./entity/Client");

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
    await clientRepo.save([{ name: 'TechSolutions SA', status: 'actif' }, { name: 'Mairie de Lyon', status: 'actif' }]);
  }
  console.log('Database seeded');
  await dataSource.destroy();
}).catch(err => {
  console.error('Seed failed', err);
});
