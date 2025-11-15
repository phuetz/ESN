import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Opportunity } from '../entity/Opportunity';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { CreateOpportunityDto, UpdateOpportunityDto } from '../dto/opportunity.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const getOpportunities = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { stage, priority, ownerId, clientId, limit = '50', page = '1' } = req.query;

    const repository = AppDataSource.getRepository(Opportunity);
    const queryBuilder = repository.createQueryBuilder('opportunity')
      .leftJoinAndSelect('opportunity.client', 'client')
      .leftJoinAndSelect('opportunity.owner', 'owner');

    if (stage) {
      queryBuilder.andWhere('opportunity.stage = :stage', { stage });
    }

    if (priority) {
      queryBuilder.andWhere('opportunity.priority = :priority', { priority });
    }

    if (ownerId) {
      queryBuilder.andWhere('opportunity.ownerId = :ownerId', { ownerId });
    }

    if (clientId) {
      queryBuilder.andWhere('opportunity.clientId = :clientId', { clientId });
    }

    queryBuilder.andWhere('opportunity.deletedAt IS NULL');

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;
    queryBuilder.take(take).skip(skip).orderBy('opportunity.createdAt', 'DESC');

    const [opportunities, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: opportunities,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getOpportunityById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Opportunity);
    const opportunity = await repository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['client', 'owner', 'activities'],
    });

    if (!opportunity) {
      throw new AppError('Opportunity not found', 404);
    }

    res.json({
      success: true,
      data: opportunity,
    });
  }
);

export const createOpportunity = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(CreateOpportunityDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Opportunity);
    const opportunity = repository.create(req.body);
    const saved = await repository.save(opportunity);

    logger.info(`Opportunity created: ${saved.title}`);

    res.status(201).json({
      success: true,
      data: saved,
    });
  }
);

export const updateOpportunity = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const dto = plainToClass(UpdateOpportunityDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Opportunity);
    const opportunity = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!opportunity) {
      throw new AppError('Opportunity not found', 404);
    }

    Object.assign(opportunity, req.body);
    const saved = await repository.save(opportunity);

    logger.info(`Opportunity updated: ${saved.title}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

export const deleteOpportunity = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Opportunity);
    const opportunity = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!opportunity) {
      throw new AppError('Opportunity not found', 404);
    }

    await repository.softDelete(id);

    logger.info(`Opportunity deleted: ${opportunity.title}`);

    res.json({
      success: true,
      message: 'Opportunity deleted successfully',
    });
  }
);

/**
 * Get pipeline statistics
 */
export const getPipelineStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const repository = AppDataSource.getRepository(Opportunity);

    const stats = await repository
      .createQueryBuilder('opportunity')
      .select('opportunity.stage', 'stage')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(opportunity.estimatedValue)', 'totalValue')
      .addSelect('AVG(opportunity.probability)', 'avgProbability')
      .where('opportunity.deletedAt IS NULL')
      .groupBy('opportunity.stage')
      .getRawMany();

    res.json({
      success: true,
      data: stats,
    });
  }
);
