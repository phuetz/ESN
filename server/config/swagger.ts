import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import config from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ESN Manager Pro API',
      version: '1.0.0',
      description:
        'API documentation for ESN Manager Pro - Enterprise Service Network Management System',
      contact: {
        name: 'API Support',
        email: 'support@esn-manager.com',
      },
    },
    servers: [
      {
        url: `http://${config.host}:${config.port}/api/${config.api.version}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Consultants', description: 'Consultant management' },
      { name: 'Clients', description: 'Client management' },
      { name: 'Projects', description: 'Project management' },
      { name: 'Health', description: 'Health check endpoints' },
    ],
  },
  apis: ['./routes/*.ts', './index.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
