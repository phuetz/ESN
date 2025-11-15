import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Interview } from '../entity/Interview';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { CreateInterviewDto, UpdateInterviewDto } from '../dto/interview.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const getInterviews = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { candidateId, status, outcome, limit = '50', page = '1' } = req.query;

    const repository = AppDataSource.getRepository(Interview);
    const queryBuilder = repository.createQueryBuilder('interview')
      .leftJoinAndSelect('interview.candidate', 'candidate')
      .leftJoinAndSelect('interview.createdBy', 'createdBy');

    if (candidateId) {
      queryBuilder.andWhere('interview.candidateId = :candidateId', { candidateId });
    }

    if (status) {
      queryBuilder.andWhere('interview.status = :status', { status });
    }

    if (outcome) {
      queryBuilder.andWhere('interview.outcome = :outcome', { outcome });
    }

    queryBuilder.andWhere('interview.deletedAt IS NULL');

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;
    queryBuilder.take(take).skip(skip).orderBy('interview.scheduledAt', 'DESC');

    const [interviews, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: interviews,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getInterviewById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Interview);
    const interview = await repository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['candidate', 'createdBy'],
    });

    if (!interview) {
      throw new AppError('Interview not found', 404);
    }

    res.json({
      success: true,
      data: interview,
    });
  }
);

export const createInterview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(CreateInterviewDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Interview);
    const interview = repository.create(req.body);
    const saved = await repository.save(interview);

    logger.info(`Interview created: ${saved.title}`);

    res.status(201).json({
      success: true,
      data: saved,
    });
  }
);

export const updateInterview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const dto = plainToClass(UpdateInterviewDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Interview);
    const interview = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!interview) {
      throw new AppError('Interview not found', 404);
    }

    Object.assign(interview, req.body);
    const saved = await repository.save(interview);

    logger.info(`Interview updated: ${saved.title}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

export const deleteInterview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Interview);
    const interview = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!interview) {
      throw new AppError('Interview not found', 404);
    }

    await repository.softDelete(id);

    logger.info(`Interview deleted: ${interview.title}`);

    res.json({
      success: true,
      message: 'Interview deleted successfully',
    });
  }
);
