import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import config from './config';
import logger from './utils/logger';
import { initializeDatabase } from './data-source';
import AppDataSource from './data-source';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimit';
import { setupSwagger } from './config/swagger';
import { enhancedSecurityHeaders, apiSecurityHeaders } from './middleware/securityHeaders';
import { csrfTokenGenerator, csrfProtection, getCsrfToken } from './middleware/csrf';

// Import routes
import authRoutes from './routes/auth.routes';
import consultantRoutes from './routes/consultant.routes';
import clientRoutes from './routes/client.routes';
import projectRoutes from './routes/project.routes';

const app = express();

// Trust proxy - important for rate limiting and logging behind reverse proxies
app.set('trust proxy', 1);

// Compression middleware - should be early in the chain
app.use(
  compression({
    // Only compress responses that are larger than 1KB
    threshold: 1024,
    // Compression level (0-9, higher = more compression but slower)
    level: 6,
    // Filter function to determine what to compress
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

// Security middleware
app.use(helmet());
app.use(enhancedSecurityHeaders);

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours
  })
);

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser middleware - must be before routes that use cookies
app.use(cookieParser());

// Data sanitization against NoSQL injection attacks
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());

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
    let dbStatus = 'disconnected';
    let dbLatency = 0;

    if (dbHealthy) {
      // Test database with a simple query
      const startTime = Date.now();
      try {
        await AppDataSource.query('SELECT 1');
        dbLatency = Date.now() - startTime;
        dbStatus = 'connected';
      } catch (error) {
        dbStatus = 'error';
      }
    }

    const memoryUsage = process.memoryUsage();
    const health = {
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: config.node_env,
      database: {
        status: dbStatus,
        latency: dbLatency > 0 ? `${dbLatency}ms` : 'N/A',
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      },
      node: process.version,
    };

    if (dbStatus !== 'connected') {
      return res.status(503).json(health);
    }

    res.json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: config.node_env,
      database: { status: 'error', latency: 'N/A' },
    });
  }
});

/**
 * @swagger
 * /metrics:
 *   get:
 *     tags: [Monitoring]
 *     summary: Application metrics endpoint
 *     responses:
 *       200:
 *         description: Application metrics
 */
app.get('/metrics', async (req: Request, res: Response) => {
  try {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
        arrayBuffers: memoryUsage.arrayBuffers,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      process: {
        pid: process.pid,
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    };

    res.json(metrics);
  } catch (error) {
    logger.error('Metrics collection failed:', error);
    res.status(500).json({ error: 'Failed to collect metrics' });
  }
});

// API routes with versioning
const apiVersion = `/api/${config.api.version}`;

// Apply rate limiting and security headers to API routes
app.use(apiVersion, apiLimiter);
app.use(apiVersion, apiSecurityHeaders);

// CSRF Protection middleware
// 1. Generate and send CSRF tokens on GET requests
app.use(apiVersion, csrfTokenGenerator);
// 2. Validate CSRF tokens on unsafe methods (POST, PUT, DELETE, PATCH)
app.use(apiVersion, csrfProtection);

// CSRF token endpoint - allows clients to get a fresh token
app.get(`${apiVersion}/csrf-token`, getCsrfToken);

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
