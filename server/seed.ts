import 'reflect-metadata';
import bcrypt from 'bcryptjs';
import AppDataSource, { initializeDatabase } from './data-source';
import { User, UserRole } from './entity/User';
import { Consultant, ConsultantStatus } from './entity/Consultant';
import { Client, ClientType, ClientStatus } from './entity/Client';
import { Project, ProjectStatus } from './entity/Project';
import logger from './utils/logger';

async function seed() {
  try {
    await initializeDatabase();
    logger.info('Starting database seed...');

    const userRepository = AppDataSource.getRepository(User);
    const consultantRepository = AppDataSource.getRepository(Consultant);
    const clientRepository = AppDataSource.getRepository(Client);
    const projectRepository = AppDataSource.getRepository(Project);

    // Check if data already exists
    const userCount = await userRepository.count();
    if (userCount > 0) {
      logger.info('Database already seeded. Skipping...');
      process.exit(0);
    }

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = userRepository.create({
      email: 'admin@esn-manager.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    });
    await userRepository.save(adminUser);
    logger.info('Admin user created');

    // Create consultants
    const consultants = [
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        role: 'Senior Developer',
        status: ConsultantStatus.ACTIVE,
        experience: 8,
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
        bio: 'Experienced full-stack developer with a passion for clean code',
        dailyRate: 600,
        city: 'Paris',
        country: 'France',
      },
      {
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@example.com',
        phone: '+33 6 23 45 67 89',
        role: 'DevOps Engineer',
        status: ConsultantStatus.ACTIVE,
        experience: 5,
        skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform'],
        bio: 'DevOps specialist focused on automation and scalability',
        dailyRate: 550,
        city: 'Lyon',
        country: 'France',
      },
      {
        firstName: 'Pierre',
        lastName: 'Bernard',
        email: 'pierre.bernard@example.com',
        phone: '+33 6 34 56 78 90',
        role: 'Data Scientist',
        status: ConsultantStatus.BENCH,
        experience: 4,
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'pandas'],
        bio: 'Data scientist with expertise in ML and predictive analytics',
        dailyRate: 580,
        city: 'Toulouse',
        country: 'France',
      },
      {
        firstName: 'Sophie',
        lastName: 'Dubois',
        email: 'sophie.dubois@example.com',
        phone: '+33 6 45 67 89 01',
        role: 'UX/UI Designer',
        status: ConsultantStatus.ACTIVE,
        experience: 6,
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
        bio: 'UX designer passionate about creating intuitive user experiences',
        dailyRate: 500,
        city: 'Bordeaux',
        country: 'France',
      },
    ];

    const savedConsultants = [];
    for (const consultantData of consultants) {
      const consultant = consultantRepository.create(consultantData);
      await consultantRepository.save(consultant);
      savedConsultants.push(consultant);
    }
    logger.info(`${consultants.length} consultants created`);

    // Create clients
    const clients = [
      {
        name: 'TechCorp Solutions',
        type: ClientType.ENTERPRISE,
        sector: 'Technology',
        contactName: 'Jacques Lefebvre',
        contactEmail: 'j.lefebvre@techcorp.com',
        contactPhone: '+33 1 42 68 53 00',
        website: 'https://www.techcorp.com',
        city: 'Paris',
        country: 'France',
        status: ClientStatus.ACTIVE,
      },
      {
        name: 'Ministère du Numérique',
        type: ClientType.PUBLIC_SECTOR,
        sector: 'Public Administration',
        contactName: 'Isabelle Moreau',
        contactEmail: 'i.moreau@numerique.gouv.fr',
        contactPhone: '+33 1 53 18 44 00',
        website: 'https://www.numerique.gouv.fr',
        city: 'Paris',
        country: 'France',
        status: ClientStatus.ACTIVE,
      },
      {
        name: 'StartupHub Inc',
        type: ClientType.STARTUP,
        sector: 'E-commerce',
        contactName: 'Thomas Petit',
        contactEmail: 'thomas@startuphub.io',
        contactPhone: '+33 9 87 65 43 21',
        website: 'https://www.startuphub.io',
        city: 'Lyon',
        country: 'France',
        status: ClientStatus.PROSPECT,
      },
    ];

    const savedClients = [];
    for (const clientData of clients) {
      const client = clientRepository.create(clientData);
      await clientRepository.save(client);
      savedClients.push(client);
    }
    logger.info(`${clients.length} clients created`);

    // Create projects
    const projects = [
      {
        name: 'E-commerce Platform Modernization',
        description: 'Migrate legacy e-commerce platform to modern microservices architecture',
        status: ProjectStatus.IN_PROGRESS,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-12-31'),
        budget: 150000,
        dailyRate: 600,
        technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
        isRemote: true,
        clientId: savedClients[0].id,
        consultantId: savedConsultants[0].id,
      },
      {
        name: 'Cloud Infrastructure Setup',
        description: 'Design and implement cloud infrastructure for government services',
        status: ProjectStatus.IN_PROGRESS,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-08-31'),
        budget: 200000,
        dailyRate: 550,
        technologies: ['Kubernetes', 'Docker', 'Terraform', 'AWS'],
        location: 'Paris, France',
        isRemote: false,
        clientId: savedClients[1].id,
        consultantId: savedConsultants[1].id,
      },
      {
        name: 'Mobile App Development',
        description: 'Develop cross-platform mobile application for startup',
        status: ProjectStatus.PLANNED,
        startDate: new Date('2024-06-01'),
        budget: 80000,
        dailyRate: 500,
        technologies: ['React Native', 'Firebase', 'TypeScript'],
        isRemote: true,
        clientId: savedClients[2].id,
      },
      {
        name: 'UX Redesign Project',
        description: 'Complete UX redesign of corporate website and mobile app',
        status: ProjectStatus.IN_PROGRESS,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-06-30'),
        budget: 60000,
        dailyRate: 500,
        technologies: ['Figma', 'React', 'Tailwind CSS'],
        isRemote: true,
        clientId: savedClients[0].id,
        consultantId: savedConsultants[3].id,
      },
    ];

    for (const projectData of projects) {
      const project = projectRepository.create(projectData);
      await projectRepository.save(project);
    }
    logger.info(`${projects.length} projects created`);

    logger.info('Database seeded successfully!');
    logger.info('\nLogin credentials:');
    logger.info('Email: admin@esn-manager.com');
    logger.info('Password: admin123');

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
