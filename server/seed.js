const dataSource = require('./data-source');
const Consultant = require('./entity/Consultant');

dataSource.initialize().then(async () => {
  const repo = dataSource.getRepository('Consultant');
  const count = await repo.count();
  if (count === 0) {
    const consultant = repo.create({
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'Développeur Full Stack',
      status: 'assigned',
      experience: 5,
    });
    await repo.save(consultant);
    console.log('Database seeded');
  }
  await dataSource.destroy();
}).catch(err => {
  console.error('Seed failed', err);
});
