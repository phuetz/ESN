import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Mission } from '../entity/Mission';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { CreateMissionDto, UpdateMissionDto } from '../dto/mission.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const getMissions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { consultantId, projectId, clientId, status, limit = '50', page = '1' } = req.query;

    const repository = AppDataSource.getRepository(Mission);
    const queryBuilder = repository.createQueryBuilder('mission')
      .leftJoinAndSelect('mission.consultant', 'consultant')
      .leftJoinAndSelect('mission.project', 'project')
      .leftJoinAndSelect('mission.client', 'client');

    if (consultantId) {
      queryBuilder.andWhere('mission.consultantId = :consultantId', { consultantId });
    }

    if (projectId) {
      queryBuilder.andWhere('mission.projectId = :projectId', { projectId });
    }

    if (clientId) {
      queryBuilder.andWhere('mission.clientId = :clientId', { clientId });
    }

    if (status) {
      queryBuilder.andWhere('mission.status = :status', { status });
    }

    queryBuilder.andWhere('mission.deletedAt IS NULL');

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;
    queryBuilder.take(take).skip(skip).orderBy('mission.startDate', 'DESC');

    const [missions, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: missions,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getMissionById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Mission);
    const mission = await repository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['consultant', 'project', 'client', 'timesheets'],
    });

    if (!mission) {
      throw new AppError('Mission not found', 404);
    }

    res.json({
      success: true,
      data: mission,
    });
  }
);

export const createMission = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(CreateMissionDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Mission);
    const mission = repository.create(req.body);
    const saved = await repository.save(mission);

    logger.info(`Mission created: ${saved.title}`);

    res.status(201).json({
      success: true,
      data: saved,
    });
  }
);

export const updateMission = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const dto = plainToClass(UpdateMissionDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Mission);
    const mission = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!mission) {
      throw new AppError('Mission not found', 404);
    }

    Object.assign(mission, req.body);
    const saved = await repository.save(mission);

    logger.info(`Mission updated: ${saved.title}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

export const deleteMission = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Mission);
    const mission = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!mission) {
      throw new AppError('Mission not found', 404);
    }

    await repository.softDelete(id);

    logger.info(`Mission deleted: ${mission.title}`);

    res.json({
      success: true,
      message: 'Mission deleted successfully',
    });
  }
);

/**
 * Get missions ending soon for alerting
 */
export const getEndingSoonMissions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { days = '30' } = req.query;

    const repository = AppDataSource.getRepository(Mission);
    const daysAhead = parseInt(days as string, 10);
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);

    const missions = await repository
      .createQueryBuilder('mission')
      .leftJoinAndSelect('mission.consultant', 'consultant')
      .leftJoinAndSelect('mission.project', 'project')
      .leftJoinAndSelect('mission.client', 'client')
      .where('mission.endDate IS NOT NULL')
      .andWhere('mission.endDate >= :today', { today })
      .andWhere('mission.endDate <= :futureDate', { futureDate })
      .andWhere('mission.status IN (:...statuses)', { statuses: ['active', 'ending_soon'] })
      .andWhere('mission.deletedAt IS NULL')
      .orderBy('mission.endDate', 'ASC')
      .getMany();

    res.json({
      success: true,
      data: missions,
      meta: {
        daysAhead,
        today,
        futureDate,
        count: missions.length,
      },
    });
  }
);
