import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Client } from '../entity/Client';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';

export const getClients = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, search, limit = '50', page = '1' } = req.query;

    const clientRepository = AppDataSource.getRepository(Client);
    const queryBuilder = clientRepository.createQueryBuilder('client');

    // Apply filters
    if (status) {
      queryBuilder.andWhere('client.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(client.name LIKE :search OR client.contactName LIKE :search OR client.contactEmail LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Soft delete filter
    queryBuilder.andWhere('client.deletedAt IS NULL');

    // Pagination
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    queryBuilder.take(take).skip(skip);

    // Get results with count
    const [clients, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: clients,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getClientById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const clientRepository = AppDataSource.getRepository(Client);
    const client = await clientRepository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['projects', 'projects.consultant'],
    });

    if (!client) {
      throw new AppError('Client not found', 404);
    }

    res.json({
      success: true,
      data: client,
    });
  }
);

export const createClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const clientRepository = AppDataSource.getRepository(Client);

    const client = clientRepository.create(req.body);
    await clientRepository.save(client);

    logger.info(`Client created: ${client.name}`);

    res.status(201).json({
      success: true,
      data: client,
    });
  }
);

export const updateClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const clientRepository = AppDataSource.getRepository(Client);
    let client = await clientRepository.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!client) {
      throw new AppError('Client not found', 404);
    }

    client = clientRepository.merge(client, req.body);
    await clientRepository.save(client);

    logger.info(`Client updated: ${client.id}`);

    res.json({
      success: true,
      data: client,
    });
  }
);

export const deleteClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const clientRepository = AppDataSource.getRepository(Client);
    const client = await clientRepository.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!client) {
      throw new AppError('Client not found', 404);
    }

    // Soft delete
    await clientRepository.softRemove(client);

    logger.info(`Client deleted: ${client.id}`);

    res.status(204).send();
  }
);
