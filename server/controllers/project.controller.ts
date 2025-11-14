import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Project } from '../entity/Project';
import { Client } from '../entity/Client';
import { Consultant } from '../entity/Consultant';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';

export const getProjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, clientId, consultantId, limit = '50', page = '1' } = req.query;

    const projectRepository = AppDataSource.getRepository(Project);
    const queryBuilder = projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.client', 'client')
      .leftJoinAndSelect('project.consultant', 'consultant');

    // Apply filters
    if (status) {
      queryBuilder.andWhere('project.status = :status', { status });
    }

    if (clientId) {
      queryBuilder.andWhere('project.clientId = :clientId', { clientId });
    }

    if (consultantId) {
      queryBuilder.andWhere('project.consultantId = :consultantId', {
        consultantId,
      });
    }

    // Soft delete filter
    queryBuilder.andWhere('project.deletedAt IS NULL');

    // Pagination
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    queryBuilder.take(take).skip(skip);

    // Get results with count
    const [projects, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: projects,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getProjectById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const projectRepository = AppDataSource.getRepository(Project);
    const project = await projectRepository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['client', 'consultant'],
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.json({
      success: true,
      data: project,
    });
  }
);

export const createProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { clientId, consultantId, ...projectData } = req.body;

    // Verify client exists
    const clientRepository = AppDataSource.getRepository(Client);
    const client = await clientRepository.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new AppError('Client not found', 404);
    }

    // Verify consultant exists if provided
    if (consultantId) {
      const consultantRepository = AppDataSource.getRepository(Consultant);
      const consultant = await consultantRepository.findOne({
        where: { id: consultantId },
      });

      if (!consultant) {
        throw new AppError('Consultant not found', 404);
      }
    }

    const projectRepository = AppDataSource.getRepository(Project);
    const project = projectRepository.create({
      ...projectData,
      clientId,
      consultantId,
    });

    await projectRepository.save(project);

    // Reload with relations
    const savedProject = await projectRepository.findOne({
      where: { id: project.id },
      relations: ['client', 'consultant'],
    });

    logger.info(`Project created: ${project.name}`);

    res.status(201).json({
      success: true,
      data: savedProject,
    });
  }
);

export const updateProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { clientId, consultantId, ...projectData } = req.body;

    const projectRepository = AppDataSource.getRepository(Project);
    let project = await projectRepository.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Verify client exists if provided
    if (clientId) {
      const clientRepository = AppDataSource.getRepository(Client);
      const client = await clientRepository.findOne({
        where: { id: clientId },
      });

      if (!client) {
        throw new AppError('Client not found', 404);
      }
    }

    // Verify consultant exists if provided
    if (consultantId) {
      const consultantRepository = AppDataSource.getRepository(Consultant);
      const consultant = await consultantRepository.findOne({
        where: { id: consultantId },
      });

      if (!consultant) {
        throw new AppError('Consultant not found', 404);
      }
    }

    project = projectRepository.merge(project, {
      ...projectData,
      ...(clientId && { clientId }),
      ...(consultantId !== undefined && { consultantId }),
    });

    await projectRepository.save(project);

    // Reload with relations
    const updatedProject = await projectRepository.findOne({
      where: { id: project.id },
      relations: ['client', 'consultant'],
    });

    logger.info(`Project updated: ${project.id}`);

    res.json({
      success: true,
      data: updatedProject,
    });
  }
);

export const deleteProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const projectRepository = AppDataSource.getRepository(Project);
    const project = await projectRepository.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Soft delete
    await projectRepository.softRemove(project);

    logger.info(`Project deleted: ${project.id}`);

    res.status(204).send();
  }
);
