import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Candidate } from '../entity/Candidate';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { CreateCandidateDto, UpdateCandidateDto } from '../dto/candidate.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const getCandidates = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, source, recruiterId, limit = '50', page = '1' } = req.query;

    const repository = AppDataSource.getRepository(Candidate);
    const queryBuilder = repository.createQueryBuilder('candidate')
      .leftJoinAndSelect('candidate.recruiter', 'recruiter');

    if (status) {
      queryBuilder.andWhere('candidate.status = :status', { status });
    }

    if (source) {
      queryBuilder.andWhere('candidate.source = :source', { source });
    }

    if (recruiterId) {
      queryBuilder.andWhere('candidate.recruiterId = :recruiterId', { recruiterId });
    }

    queryBuilder.andWhere('candidate.deletedAt IS NULL');

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;
    queryBuilder.take(take).skip(skip).orderBy('candidate.createdAt', 'DESC');

    const [candidates, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: candidates,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getCandidateById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Candidate);
    const candidate = await repository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['recruiter', 'interviews'],
    });

    if (!candidate) {
      throw new AppError('Candidate not found', 404);
    }

    res.json({
      success: true,
      data: candidate,
    });
  }
);

export const createCandidate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(CreateCandidateDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Candidate);
    const candidate = repository.create(req.body);
    const saved = await repository.save(candidate);

    logger.info(`Candidate created: ${saved.firstName} ${saved.lastName}`);

    res.status(201).json({
      success: true,
      data: saved,
    });
  }
);

export const updateCandidate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const dto = plainToClass(UpdateCandidateDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Candidate);
    const candidate = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!candidate) {
      throw new AppError('Candidate not found', 404);
    }

    Object.assign(candidate, req.body);
    const saved = await repository.save(candidate);

    logger.info(`Candidate updated: ${saved.firstName} ${saved.lastName}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

export const deleteCandidate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Candidate);
    const candidate = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!candidate) {
      throw new AppError('Candidate not found', 404);
    }

    await repository.softDelete(id);

    logger.info(`Candidate deleted: ${candidate.firstName} ${candidate.lastName}`);

    res.json({
      success: true,
      message: 'Candidate deleted successfully',
    });
  }
);
