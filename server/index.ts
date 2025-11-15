import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';
import logger from './utils/logger';
import { initializeDatabase } from './data-source';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimit';
import { setupSwagger } from './config/swagger';

// Import routes
import authRoutes from './routes/auth.routes';
import consultantRoutes from './routes/consultant.routes';
import clientRoutes from './routes/client.routes';
import projectRoutes from './routes/project.routes';
// CRM routes
import opportunityRoutes from './routes/opportunity.routes';
import activityRoutes from './routes/activity.routes';
import contactRoutes from './routes/contact.routes';
// Invoicing routes
import quoteRoutes from './routes/quote.routes';
import invoiceRoutes from './routes/invoice.routes';
// Recruitment routes
import candidateRoutes from './routes/candidate.routes';
import interviewRoutes from './routes/interview.routes';
// HR routes
import leaveRoutes from './routes/leave.routes';
import expenseRoutes from './routes/expense.routes';
// Resource planning routes
import missionRoutes from './routes/mission.routes';
import timesheetRoutes from './routes/timesheet.routes';
// Skills management routes
import skillRoutes from './routes/skill.routes';
import consultantSkillRoutes from './routes/consultant-skill.routes';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.node_env,
  });
});

// API routes with versioning
const apiVersion = `/api/${config.api.version}`;

// Apply rate limiting to API routes
app.use(apiVersion, apiLimiter);

// Mount routes
app.use(`${apiVersion}/auth`, authRoutes);
app.use(`${apiVersion}/consultants`, consultantRoutes);
app.use(`${apiVersion}/clients`, clientRoutes);
app.use(`${apiVersion}/projects`, projectRoutes);
// CRM routes
app.use(`${apiVersion}/opportunities`, opportunityRoutes);
app.use(`${apiVersion}/activities`, activityRoutes);
app.use(`${apiVersion}/contacts`, contactRoutes);
// Invoicing routes
app.use(`${apiVersion}/quotes`, quoteRoutes);
app.use(`${apiVersion}/invoices`, invoiceRoutes);
// Recruitment routes
app.use(`${apiVersion}/candidates`, candidateRoutes);
app.use(`${apiVersion}/interviews`, interviewRoutes);
// HR routes
app.use(`${apiVersion}/leaves`, leaveRoutes);
app.use(`${apiVersion}/expenses`, expenseRoutes);
// Resource planning routes
app.use(`${apiVersion}/missions`, missionRoutes);
app.use(`${apiVersion}/timesheets`, timesheetRoutes);
// Skills management routes
app.use(`${apiVersion}/skills`, skillRoutes);
app.use(`${apiVersion}/consultant-skills`, consultantSkillRoutes);

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
process.on('unhandledRejection', (reason: any) => {
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
