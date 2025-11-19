import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';
import logger from './utils/logger';
import { initializeDatabase } from './data-source';
import AppDataSource from './data-source';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimit';
import { setupSwagger } from './config/swagger';
import { enhancedSecurityHeaders, apiSecurityHeaders } from './middleware/securityHeaders';

// Import routes
import authRoutes from './routes/auth.routes';
import consultantRoutes from './routes/consultant.routes';
import clientRoutes from './routes/client.routes';
import projectRoutes from './routes/project.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(enhancedSecurityHeaders);

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Server is healthy
 *       503:
 *         description: Server is unhealthy
 */
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Check database connection
    const dbHealthy = AppDataSource.isInitialized;

    if (!dbHealthy) {
      return res.status(503).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.node_env,
        database: 'disconnected',
      });
    }

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.node_env,
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.node_env,
      database: 'error',
    });
  }
});

// API routes with versioning
const apiVersion = `/api/${config.api.version}`;

// Apply rate limiting and security headers to API routes
app.use(apiVersion, apiLimiter);
app.use(apiVersion, apiSecurityHeaders);

// Mount routes
app.use(`${apiVersion}/auth`, authRoutes);
app.use(`${apiVersion}/consultants`, consultantRoutes);
app.use(`${apiVersion}/clients`, clientRoutes);
app.use(`${apiVersion}/projects`, projectRoutes);

// Setup Swagger documentation
setupSwagger(app);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    logger.info('Database initialized successfully');

    // Start server
    app.listen(config.port, () => {
      logger.info(
        `Server running on http://${config.host}:${config.port} in ${config.node_env} mode`
      );
      logger.info(
        `API documentation available at http://${config.host}:${config.port}/api-docs`
      );
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

startServer();

export default app;
