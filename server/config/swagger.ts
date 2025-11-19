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
        'API documentation for ESN Manager Pro - Enterprise Service Network Management System. ' +
        'This API provides comprehensive endpoints for managing consultants, clients, and projects ' +
        'with features including authentication, role-based access control, pagination, and search capabilities.',
      contact: {
        name: 'API Support',
        email: 'support@esn-manager.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://${config.host}:${config.port}/api/${config.api.version}`,
        description: 'Development server',
      },
      {
        url: `https://api.esn-manager.com/api/${config.api.version}`,
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT authorization token. Format: Bearer {token}',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Resource not found',
                },
                code: {
                  type: 'string',
                  example: 'NOT_FOUND',
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
            },
            path: {
              type: 'string',
              example: '/api/v1/consultants/999',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 1,
              description: 'Current page number',
            },
            limit: {
              type: 'integer',
              example: 50,
              description: 'Items per page',
            },
            total: {
              type: 'integer',
              example: 150,
              description: 'Total number of items',
            },
            pages: {
              type: 'integer',
              example: 3,
              description: 'Total number of pages',
            },
            hasNextPage: {
              type: 'boolean',
              example: true,
              description: 'Whether there is a next page',
            },
            hasPrevPage: {
              type: 'boolean',
              example: false,
              description: 'Whether there is a previous page',
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                error: {
                  message: 'Invalid token',
                  code: 'UNAUTHORIZED',
                },
                timestamp: '2024-01-15T10:30:00Z',
                path: '/api/v1/consultants',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'User does not have permission to perform this action',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                error: {
                  message: 'You do not have permission to perform this action',
                  code: 'FORBIDDEN',
                },
                timestamp: '2024-01-15T10:30:00Z',
                path: '/api/v1/consultants',
              },
            },
          },
        },
        NotFoundError: {
          description: 'The requested resource was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                error: {
                  message: 'Resource not found',
                  code: 'NOT_FOUND',
                },
                timestamp: '2024-01-15T10:30:00Z',
                path: '/api/v1/consultants/999',
              },
            },
          },
        },
        ValidationError: {
          description: 'Request validation failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                error: {
                  message: 'Invalid pagination parameters',
                  code: 'VALIDATION_ERROR',
                },
                timestamp: '2024-01-15T10:30:00Z',
                path: '/api/v1/consultants',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication and authorization endpoints including login, register, and token refresh',
      },
      {
        name: 'Consultants',
        description: 'CRUD operations for consultant management with filtering, search, and pagination',
      },
      {
        name: 'Clients',
        description: 'CRUD operations for client management with filtering, search, and pagination',
      },
      {
        name: 'Projects',
        description: 'CRUD operations for project management with consultant and client relationships',
      },
      {
        name: 'Health',
        description: 'Health check and monitoring endpoints for application status',
      },
      {
        name: 'Monitoring',
        description: 'Application metrics and performance monitoring endpoints',
      },
    ],
  },
  apis: ['./routes/*.ts', './index.ts', './controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
