import { Request, Response, NextFunction } from 'express';
import { Like } from 'typeorm';
import AppDataSource from '../data-source';
import { Consultant } from '../entity/Consultant';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';

export const getConsultants = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, search, limit = '50', page = '1' } = req.query;

    const consultantRepository = AppDataSource.getRepository(Consultant);
    const queryBuilder = consultantRepository.createQueryBuilder('consultant');

    // Apply filters
    if (status) {
      queryBuilder.andWhere('consultant.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(consultant.firstName LIKE :search OR consultant.lastName LIKE :search OR consultant.email LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Soft delete filter
    queryBuilder.andWhere('consultant.deletedAt IS NULL');

    // Pagination
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    queryBuilder.take(take).skip(skip);

    // Get results with count
    const [consultants, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: consultants,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getConsultantById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const consultantRepository = AppDataSource.getRepository(Consultant);
    const consultant = await consultantRepository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['projects', 'projects.client'],
    });

    if (!consultant) {
      throw new AppError('Consultant not found', 404);
    }

    res.json({
      success: true,
      data: consultant,
    });
  }
);

export const createConsultant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const consultantRepository = AppDataSource.getRepository(Consultant);

    const consultant = consultantRepository.create(req.body);
    const savedConsultant = await consultantRepository.save(consultant);

    logger.info(`Consultant created: ${savedConsultant.firstName} ${savedConsultant.lastName}`);

    res.status(201).json({
      success: true,
      data: savedConsultant,
    });
  }
);

export const updateConsultant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const consultantRepository = AppDataSource.getRepository(Consultant);
    let consultant = await consultantRepository.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!consultant) {
      throw new AppError('Consultant not found', 404);
    }

    consultant = consultantRepository.merge(consultant, req.body);
    await consultantRepository.save(consultant);

    logger.info(`Consultant updated: ${consultant.id}`);

    res.json({
      success: true,
      data: consultant,
    });
  }
);

export const deleteConsultant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const consultantRepository = AppDataSource.getRepository(Consultant);
    const consultant = await consultantRepository.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!consultant) {
      throw new AppError('Consultant not found', 404);
    }

    // Soft delete
    await consultantRepository.softRemove(consultant);

    logger.info(`Consultant deleted: ${consultant.id}`);

    res.status(204).send();
  }
);
