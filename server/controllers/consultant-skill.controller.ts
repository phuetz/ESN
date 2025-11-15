import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { ConsultantSkill } from '../entity/ConsultantSkill';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { CreateConsultantSkillDto, UpdateConsultantSkillDto } from '../dto/consultant-skill.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const getConsultantSkills = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { consultantId, skillId, level, limit = '50', page = '1' } = req.query;

    const repository = AppDataSource.getRepository(ConsultantSkill);
    const queryBuilder = repository.createQueryBuilder('consultantSkill')
      .leftJoinAndSelect('consultantSkill.consultant', 'consultant')
      .leftJoinAndSelect('consultantSkill.skill', 'skill');

    if (consultantId) {
      queryBuilder.andWhere('consultantSkill.consultantId = :consultantId', { consultantId });
    }

    if (skillId) {
      queryBuilder.andWhere('consultantSkill.skillId = :skillId', { skillId });
    }

    if (level) {
      queryBuilder.andWhere('consultantSkill.level = :level', { level });
    }

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;
    queryBuilder.take(take).skip(skip).orderBy('consultantSkill.createdAt', 'DESC');

    const [consultantSkills, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: consultantSkills,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getConsultantSkillById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(ConsultantSkill);
    const consultantSkill = await repository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['consultant', 'skill'],
    });

    if (!consultantSkill) {
      throw new AppError('Consultant skill not found', 404);
    }

    res.json({
      success: true,
      data: consultantSkill,
    });
  }
);

export const createConsultantSkill = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(CreateConsultantSkillDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(ConsultantSkill);

    // Check if this consultant-skill combination already exists
    const existing = await repository.findOne({
      where: {
        consultantId: req.body.consultantId,
        skillId: req.body.skillId,
      },
    });

    if (existing) {
      throw new AppError('This skill is already assigned to this consultant', 400);
    }

    const consultantSkill = repository.create(req.body);
    const saved = await repository.save(consultantSkill);

    logger.info(`Consultant skill created: Consultant ${saved.consultantId}, Skill ${saved.skillId}`);

    res.status(201).json({
      success: true,
      data: saved,
    });
  }
);

export const updateConsultantSkill = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const dto = plainToClass(UpdateConsultantSkillDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(ConsultantSkill);
    const consultantSkill = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!consultantSkill) {
      throw new AppError('Consultant skill not found', 404);
    }

    Object.assign(consultantSkill, req.body);
    const saved = await repository.save(consultantSkill);

    logger.info(`Consultant skill updated: ${saved.id}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

export const deleteConsultantSkill = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(ConsultantSkill);
    const consultantSkill = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!consultantSkill) {
      throw new AppError('Consultant skill not found', 404);
    }

    await repository.remove(consultantSkill);

    logger.info(`Consultant skill deleted: ${consultantSkill.id}`);

    res.json({
      success: true,
      message: 'Consultant skill deleted successfully',
    });
  }
);
