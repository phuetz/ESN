import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import config from './config';
import { User } from './entity/User';
import { Consultant } from './entity/Consultant';
import { Client } from './entity/Client';
import { Project } from './entity/Project';
import logger from './utils/logger';

// Base configuration shared by all database types
const baseConfig = {
  entities: [User, Consultant, Client, Project],
  migrations: ['./migrations/*.ts'],
  subscribers: [],
  synchronize: config.node_env === 'development', // Only in development
  logging: config.node_env === 'development' ? true : false,
  logger: 'advanced-console' as const,
  // Enable query result caching
  cache: {
    duration: 30000, // 30 seconds
    type: 'database' as const,
  },
  // Additional common options
  maxQueryExecutionTime: 5000, // Log queries taking more than 5 seconds
};

// PostgreSQL-specific configuration
const postgresConfig: DataSourceOptions = {
  ...baseConfig,
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  // Connection pool settings for better performance
  extra: {
    max: 20, // Maximum number of connections in the pool
    min: 5, // Minimum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 10000, // Connection timeout
    // SSL configuration for production
    ...(config.node_env === 'production' && {
      ssl: {
        rejectUnauthorized: false,
      },
    }),
  },
  // Connection retry strategy
  connectTimeoutMS: 10000,
  // Enable query result caching with Redis in production (if available)
  ...(config.node_env === 'production' && {
    cache: {
      duration: 60000, // 60 seconds in production
      type: 'database' as const,
    },
  }),
};

// SQLite-specific configuration
const sqliteConfig: DataSourceOptions = {
  ...baseConfig,
  type: 'sqlite',
  database: config.database.database,
  // SQLite-specific optimizations
  extra: {
    // Enable Write-Ahead Logging for better concurrency
    pragma: {
      journal_mode: 'WAL',
      synchronous: 'NORMAL',
      cache_size: -64000, // 64MB cache
      temp_store: 'MEMORY',
      mmap_size: 30000000000, // 30GB memory-mapped I/O
    },
  },
};

// Select configuration based on database type
const dataSourceConfig =
  config.database.type === 'postgres' ? postgresConfig : sqliteConfig;

const AppDataSource = new DataSource(dataSourceConfig);

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
