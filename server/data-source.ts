import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from './config';
import { User } from './entity/User';
import { Consultant } from './entity/Consultant';
import { Client } from './entity/Client';
import { Project } from './entity/Project';
import { Contact } from './entity/Contact';
import { Opportunity } from './entity/Opportunity';
import { Activity } from './entity/Activity';
import { Quote } from './entity/Quote';
import { QuoteItem } from './entity/QuoteItem';
import { Invoice } from './entity/Invoice';
import { InvoiceItem } from './entity/InvoiceItem';
import { Candidate } from './entity/Candidate';
import { Interview } from './entity/Interview';
import { Leave } from './entity/Leave';
import { Expense } from './entity/Expense';
import { Skill } from './entity/Skill';
import { ConsultantSkill } from './entity/ConsultantSkill';
import { Notification } from './entity/Notification';
import { Mission } from './entity/Mission';
import { Timesheet } from './entity/Timesheet';
import { Document } from './entity/Document';
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
  entities: [
    User,
    Consultant,
    Client,
    Project,
    Contact,
    Opportunity,
    Activity,
    Quote,
    QuoteItem,
    Invoice,
    InvoiceItem,
    Candidate,
    Interview,
    Leave,
    Expense,
    Skill,
    ConsultantSkill,
    Notification,
    Mission,
    Timesheet,
    Document,
  ],
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
