/**
 * Environment Variable Validator
 * Validates and ensures all required environment variables are set
 */

import logger from '../utils/logger';

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  HOST: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  DB_TYPE: string;
  DB_DATABASE: string;
}

const requiredEnvVars = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
] as const;

const optionalEnvVarsWithDefaults = {
  NODE_ENV: 'development',
  PORT: '3001',
  HOST: 'localhost',
  DB_TYPE: 'sqlite',
  DB_DATABASE: './server/db.sqlite',
} as const;

/**
 * Validates that all required environment variables are set
 * @throws {Error} if required environment variables are missing or invalid
 */
export function validateEnv(): void {
  const missingVars: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  // Check for default/insecure secrets in production
  if (process.env.NODE_ENV === 'production') {
    const defaultSecrets = [
      'default-secret-change-this',
      'default-refresh-secret',
      'your-super-secret-jwt-key-change-this-in-production',
      'your-refresh-token-secret-change-this'
    ];

    if (process.env.JWT_SECRET && defaultSecrets.includes(process.env.JWT_SECRET)) {
      missingVars.push('JWT_SECRET (using default value in production!)');
    }

    if (process.env.JWT_REFRESH_SECRET && defaultSecrets.includes(process.env.JWT_REFRESH_SECRET)) {
      missingVars.push('JWT_REFRESH_SECRET (using default value in production!)');
    }

    // Check JWT secret length in production
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      warnings.push('JWT_SECRET is too short (< 32 characters) for production use');
    }

    if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length < 32) {
      warnings.push('JWT_REFRESH_SECRET is too short (< 32 characters) for production use');
    }

    // Check database configuration for production
    if (process.env.DB_TYPE === 'sqlite') {
      warnings.push('Using SQLite in production - consider using PostgreSQL instead');
    }
  }

  // Log warnings
  if (warnings.length > 0) {
    warnings.forEach(warning => {
      logger.warn(`Environment validation warning: ${warning}`);
    });
  }

  // Throw error if required variables are missing
  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  logger.info('Environment variables validated successfully');
}

/**
 * Checks if JWT secrets are secure
 */
export function checkSecretSecurity(): void {
  const jwtSecret = process.env.JWT_SECRET || '';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || '';

  const insecurePatterns = [
    /^(secret|password|123|test|demo|default)/i,
    /^.{0,15}$/  // Less than 16 characters
  ];

  let hasWarnings = false;

  for (const pattern of insecurePatterns) {
    if (pattern.test(jwtSecret)) {
      logger.warn('JWT_SECRET appears to be insecure. Use a strong, random secret.');
      hasWarnings = true;
      break;
    }
  }

  for (const pattern of insecurePatterns) {
    if (pattern.test(refreshSecret)) {
      logger.warn('JWT_REFRESH_SECRET appears to be insecure. Use a strong, random secret.');
      hasWarnings = true;
      break;
    }
  }

  if (!hasWarnings && process.env.NODE_ENV !== 'production') {
    logger.info('JWT secrets appear to be properly configured');
  }
}

/**
 * Generates a random secret for development (DO NOT use in production)
 */
export function generateDevSecret(length: number = 64): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
