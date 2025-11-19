import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Client } from '../entity/Client';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';

/**
 * Get all clients with filtering, searching and pagination
 * @route GET /api/v1/clients
 * @query {string} status - Filter by client status (ACTIVE, INACTIVE)
 * @query {string} search - Search in name, contactName, contactEmail
 * @query {number} limit - Number of results per page (default: 50, max: 100)
 * @query {number} page - Page number (default: 1)
 */
export const getClients = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, search, limit = '50', page = '1' } = req.query;

    // Validate and sanitize pagination parameters
    const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100); // Max 100 per page
    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1); // Min page 1

    if (isNaN(limitNum) || isNaN(pageNum)) {
      throw new AppError('Invalid pagination parameters', 400, 'INVALID_PAGINATION');
    }

    const clientRepository = AppDataSource.getRepository(Client);
    const queryBuilder = clientRepository.createQueryBuilder('client');

    // Apply filters
    if (status) {
      // Validate status value
      const validStatuses = ['ACTIVE', 'INACTIVE'];
      if (!validStatuses.includes(status as string)) {
        throw new AppError('Invalid status value', 400, 'INVALID_STATUS');
      }
      queryBuilder.andWhere('client.status = :status', { status });
    }

    if (search) {
      // Sanitize search input to prevent SQL injection
      const sanitizedSearch = (search as string).replace(/[%_]/g, '\\$&');
      queryBuilder.andWhere(
        '(client.name LIKE :search OR client.contactName LIKE :search OR client.contactEmail LIKE :search)',
        { search: `%${sanitizedSearch}%` }
      );
    }

    // Soft delete filter
    queryBuilder.andWhere('client.deletedAt IS NULL');

    // Pagination
    const skip = (pageNum - 1) * limitNum;
    queryBuilder.take(limitNum).skip(skip);

    // Add ordering for consistent results
    queryBuilder.orderBy('client.createdAt', 'DESC');

    // Get results with count
    const startTime = Date.now();
    const [clients, total] = await queryBuilder.getManyAndCount();
    const queryTime = Date.now() - startTime;

    logger.info(`Fetched ${clients.length} clients in ${queryTime}ms`, {
      page: pageNum,
      limit: limitNum,
      total,
    });

    res.json({
      success: true,
      data: clients,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNextPage: pageNum * limitNum < total,
        hasPrevPage: pageNum > 1,
      },
      meta: {
        queryTime: `${queryTime}ms`,
      },
    });
  }
);

/**
 * Get a single client by ID
 * @route GET /api/v1/clients/:id
 */
export const getClientById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const clientId = parseInt(id, 10);

    if (isNaN(clientId)) {
      throw new AppError('Invalid client ID', 400, 'INVALID_ID');
    }

    const clientRepository = AppDataSource.getRepository(Client);
    const client = await clientRepository.findOne({
      where: { id: clientId },
      relations: ['projects', 'projects.consultant'],
    });

    if (!client) {
      throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');
    }

    res.json({
      success: true,
      data: client,
    });
  }
);

/**
 * Create a new client
 * @route POST /api/v1/clients
 */
export const createClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const clientRepository = AppDataSource.getRepository(Client);

    // Check for duplicate email
    if (req.body.contactEmail) {
      const existingClient = await clientRepository.findOne({
        where: { contactEmail: req.body.contactEmail },
      });

      if (existingClient) {
        throw new AppError(
          'A client with this email already exists',
          409,
          'DUPLICATE_EMAIL'
        );
      }
    }

    // Use transaction for data integrity
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const client = clientRepository.create(req.body);
      const savedClient = (await queryRunner.manager.save(client)) as unknown as Client;

      await queryRunner.commitTransaction();

      logger.info(`Client created: ${savedClient.name} (ID: ${savedClient.id})`, {
        clientId: savedClient.id,
        contactEmail: savedClient.contactEmail,
      });

      res.status(201).json({
        success: true,
        data: savedClient,
        message: 'Client created successfully',
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
);

/**
 * Update an existing client
 * @route PUT /api/v1/clients/:id
 */
export const updateClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const clientId = parseInt(id, 10);

    if (isNaN(clientId)) {
      throw new AppError('Invalid client ID', 400, 'INVALID_ID');
    }

    const clientRepository = AppDataSource.getRepository(Client);

    // Use transaction for data integrity
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let client = await queryRunner.manager.findOne(Client, {
        where: { id: clientId },
      });

      if (!client) {
        throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');
      }

      // Check for duplicate email if email is being updated
      if (req.body.contactEmail && req.body.contactEmail !== client.contactEmail) {
        const existingClient = await queryRunner.manager.findOne(Client, {
          where: { contactEmail: req.body.contactEmail },
        });

        if (existingClient) {
          throw new AppError(
            'A client with this email already exists',
            409,
            'DUPLICATE_EMAIL'
          );
        }
      }

      client = clientRepository.merge(client, req.body);
      await queryRunner.manager.save(client);

      await queryRunner.commitTransaction();

      logger.info(`Client updated: ${client.id}`, {
        clientId: client.id,
        updatedFields: Object.keys(req.body),
      });

      res.json({
        success: true,
        data: client,
        message: 'Client updated successfully',
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
);

/**
 * Soft delete a client
 * @route DELETE /api/v1/clients/:id
 */
export const deleteClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const clientId = parseInt(id, 10);

    if (isNaN(clientId)) {
      throw new AppError('Invalid client ID', 400, 'INVALID_ID');
    }

    const clientRepository = AppDataSource.getRepository(Client);
    const client = await clientRepository.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');
    }

    // Soft delete
    await clientRepository.softRemove(client);

    logger.info(`Client soft deleted: ${client.id}`, {
      clientId: client.id,
      name: client.name,
    });

    res.status(204).send();
  }
);
