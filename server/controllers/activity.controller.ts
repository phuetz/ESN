import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Activity } from '../entity/Activity';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { CreateActivityDto, UpdateActivityDto } from '../dto/activity.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const getActivities = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, status, ownerId, clientId, opportunityId, limit = '50', page = '1' } = req.query;

    const repository = AppDataSource.getRepository(Activity);
    const queryBuilder = repository.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.owner', 'owner')
      .leftJoinAndSelect('activity.client', 'client')
      .leftJoinAndSelect('activity.contact', 'contact')
      .leftJoinAndSelect('activity.opportunity', 'opportunity');

    if (type) {
      queryBuilder.andWhere('activity.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('activity.status = :status', { status });
    }

    if (ownerId) {
      queryBuilder.andWhere('activity.ownerId = :ownerId', { ownerId });
    }

    if (clientId) {
      queryBuilder.andWhere('activity.clientId = :clientId', { clientId });
    }

    if (opportunityId) {
      queryBuilder.andWhere('activity.opportunityId = :opportunityId', { opportunityId });
    }

    queryBuilder.andWhere('activity.deletedAt IS NULL');

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;
    queryBuilder.take(take).skip(skip).orderBy('activity.createdAt', 'DESC');

    const [activities, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: activities,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getActivityById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Activity);
    const activity = await repository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['owner', 'client', 'contact', 'opportunity'],
    });

    if (!activity) {
      throw new AppError('Activity not found', 404);
    }

    res.json({
      success: true,
      data: activity,
    });
  }
);

export const createActivity = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(CreateActivityDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Activity);
    const activity = repository.create(req.body);
    const saved = await repository.save(activity);

    logger.info(`Activity created: ${saved.subject}`);

    res.status(201).json({
      success: true,
      data: saved,
    });
  }
);

export const updateActivity = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const dto = plainToClass(UpdateActivityDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Activity);
    const activity = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!activity) {
      throw new AppError('Activity not found', 404);
    }

    Object.assign(activity, req.body);
    const saved = await repository.save(activity);

    logger.info(`Activity updated: ${saved.subject}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

export const deleteActivity = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Activity);
    const activity = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!activity) {
      throw new AppError('Activity not found', 404);
    }

    await repository.softDelete(id);

    logger.info(`Activity deleted: ${activity.subject}`);

    res.json({
      success: true,
      message: 'Activity deleted successfully',
    });
  }
);
