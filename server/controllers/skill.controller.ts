import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Skill } from '../entity/Skill';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const getSkills = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { category, isActive, limit = '50', page = '1' } = req.query;

    const repository = AppDataSource.getRepository(Skill);
    const queryBuilder = repository.createQueryBuilder('skill');

    if (category) {
      queryBuilder.andWhere('skill.category = :category', { category });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('skill.isActive = :isActive', { isActive: isActive === 'true' });
    }

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;
    queryBuilder.take(take).skip(skip).orderBy('skill.name', 'ASC');

    const [skills, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: skills,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getSkillById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Skill);
    const skill = await repository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['consultantSkills'],
    });

    if (!skill) {
      throw new AppError('Skill not found', 404);
    }

    res.json({
      success: true,
      data: skill,
    });
  }
);

export const createSkill = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(CreateSkillDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Skill);

    // Check if skill with same name already exists
    const existing = await repository.findOne({ where: { name: req.body.name } });
    if (existing) {
      throw new AppError('Skill with this name already exists', 400);
    }

    const skill = repository.create(req.body);
    const saved = await repository.save(skill);

    logger.info(`Skill created: ${saved.name}`);

    res.status(201).json({
      success: true,
      data: saved,
    });
  }
);

export const updateSkill = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const dto = plainToClass(UpdateSkillDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Skill);
    const skill = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!skill) {
      throw new AppError('Skill not found', 404);
    }

    // Check if updating name to an existing skill name
    if (req.body.name && req.body.name !== skill.name) {
      const existing = await repository.findOne({ where: { name: req.body.name } });
      if (existing) {
        throw new AppError('Skill with this name already exists', 400);
      }
    }

    Object.assign(skill, req.body);
    const saved = await repository.save(skill);

    logger.info(`Skill updated: ${saved.name}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

export const deleteSkill = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Skill);
    const skill = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!skill) {
      throw new AppError('Skill not found', 404);
    }

    await repository.remove(skill);

    logger.info(`Skill deleted: ${skill.name}`);

    res.json({
      success: true,
      message: 'Skill deleted successfully',
    });
  }
);
