import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from './config';
import { User } from './entity/User';
import { Consultant } from './entity/Consultant';
import { Client } from './entity/Client';
import { Project } from './entity/Project';
import logger from './utils/logger';

const AppDataSource = new DataSource({
  type: config.database.type as 'sqlite' | 'postgres',
  database: config.database.database,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  synchronize: config.node_env === 'development', // Only in development
  logging: config.node_env === 'development',
  entities: [User, Consultant, Client, Project],
  migrations: ['./migrations/*.ts'],
  subscribers: [],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Error during database initialization:', error);
    throw error;
  }
};

export default AppDataSource;
