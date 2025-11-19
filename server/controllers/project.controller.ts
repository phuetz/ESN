import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Project } from '../entity/Project';
import { Client } from '../entity/Client';
import { Consultant } from '../entity/Consultant';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';

/**
 * Get all projects with filtering and pagination
 * @route GET /api/v1/projects
 * @query {string} status - Filter by project status (PLANNED, IN_PROGRESS, COMPLETED, CANCELLED)
 * @query {number} clientId - Filter by client ID
 * @query {number} consultantId - Filter by consultant ID
 * @query {number} limit - Number of results per page (default: 50, max: 100)
 * @query {number} page - Page number (default: 1)
 */
export const getProjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, clientId, consultantId, limit = '50', page = '1' } = req.query;

    // Validate and sanitize pagination parameters
    const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100); // Max 100 per page
    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1); // Min page 1

    if (isNaN(limitNum) || isNaN(pageNum)) {
      throw new AppError('Invalid pagination parameters', 400, 'INVALID_PAGINATION');
    }

    const projectRepository = AppDataSource.getRepository(Project);
    const queryBuilder = projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.client', 'client')
      .leftJoinAndSelect('project.consultant', 'consultant');

    // Apply filters
    if (status) {
      // Validate status value
      const validStatuses = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
      if (!validStatuses.includes(status as string)) {
        throw new AppError('Invalid status value', 400, 'INVALID_STATUS');
      }
      queryBuilder.andWhere('project.status = :status', { status });
    }

    if (clientId) {
      const clientIdNum = parseInt(clientId as string, 10);
      if (isNaN(clientIdNum)) {
        throw new AppError('Invalid client ID', 400, 'INVALID_CLIENT_ID');
      }
      queryBuilder.andWhere('project.clientId = :clientId', { clientId: clientIdNum });
    }

    if (consultantId) {
      const consultantIdNum = parseInt(consultantId as string, 10);
      if (isNaN(consultantIdNum)) {
        throw new AppError('Invalid consultant ID', 400, 'INVALID_CONSULTANT_ID');
      }
      queryBuilder.andWhere('project.consultantId = :consultantId', {
        consultantId: consultantIdNum,
      });
    }

    // Soft delete filter
    queryBuilder.andWhere('project.deletedAt IS NULL');

    // Pagination
    const skip = (pageNum - 1) * limitNum;
    queryBuilder.take(limitNum).skip(skip);

    // Add ordering for consistent results
    queryBuilder.orderBy('project.createdAt', 'DESC');

    // Get results with count
    const startTime = Date.now();
    const [projects, total] = await queryBuilder.getManyAndCount();
    const queryTime = Date.now() - startTime;

    logger.info(`Fetched ${projects.length} projects in ${queryTime}ms`, {
      page: pageNum,
      limit: limitNum,
      total,
    });

    res.json({
      success: true,
      data: projects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNextPage: pageNum * limitNum < total,
        hasPrevPage: pageNum > 1,
      },
      meta: {
        queryTime: `${queryTime}ms`,
      },
    });
  }
);

/**
 * Get a single project by ID
 * @route GET /api/v1/projects/:id
 */
export const getProjectById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const projectId = parseInt(id, 10);

    if (isNaN(projectId)) {
      throw new AppError('Invalid project ID', 400, 'INVALID_ID');
    }

    const projectRepository = AppDataSource.getRepository(Project);
    const project = await projectRepository.findOne({
      where: { id: projectId },
      relations: ['client', 'consultant'],
    });

    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    res.json({
      success: true,
      data: project,
    });
  }
);

/**
 * Create a new project
 * @route POST /api/v1/projects
 */
export const createProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { clientId, consultantId, ...projectData } = req.body;

    if (!clientId) {
      throw new AppError('Client ID is required', 400, 'CLIENT_ID_REQUIRED');
    }

    // Use transaction for data integrity
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify client exists
      const client = await queryRunner.manager.findOne(Client, {
        where: { id: clientId },
      });

      if (!client) {
        throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');
      }

      // Verify consultant exists if provided
      if (consultantId) {
        const consultant = await queryRunner.manager.findOne(Consultant, {
          where: { id: consultantId },
        });

        if (!consultant) {
          throw new AppError('Consultant not found', 404, 'CONSULTANT_NOT_FOUND');
        }
      }

      const projectRepository = AppDataSource.getRepository(Project);
      const project = projectRepository.create({
        ...projectData,
        clientId,
        consultantId,
      });

      const createdProject = (await queryRunner.manager.save(project)) as unknown as Project;

      // Reload with relations
      const savedProject = await queryRunner.manager.findOne(Project, {
        where: { id: createdProject.id },
        relations: ['client', 'consultant'],
      });

      await queryRunner.commitTransaction();

      logger.info(`Project created: ${createdProject.name} (ID: ${createdProject.id})`, {
        projectId: createdProject.id,
        clientId,
        consultantId,
      });

      res.status(201).json({
        success: true,
        data: savedProject,
        message: 'Project created successfully',
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
);

/**
 * Update an existing project
 * @route PUT /api/v1/projects/:id
 */
export const updateProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const projectId = parseInt(id, 10);

    if (isNaN(projectId)) {
      throw new AppError('Invalid project ID', 400, 'INVALID_ID');
    }

    const { clientId, consultantId, ...projectData } = req.body;

    // Use transaction for data integrity
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const projectRepository = AppDataSource.getRepository(Project);
      let project = await queryRunner.manager.findOne(Project, {
        where: { id: projectId },
      });

      if (!project) {
        throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
      }

      // Verify client exists if provided
      if (clientId && clientId !== project.clientId) {
        const client = await queryRunner.manager.findOne(Client, {
          where: { id: clientId },
        });

        if (!client) {
          throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');
        }
      }

      // Verify consultant exists if provided
      if (consultantId !== undefined && consultantId !== project.consultantId) {
        if (consultantId !== null) {
          const consultant = await queryRunner.manager.findOne(Consultant, {
            where: { id: consultantId },
          });

          if (!consultant) {
            throw new AppError('Consultant not found', 404, 'CONSULTANT_NOT_FOUND');
          }
        }
      }

      project = projectRepository.merge(project, {
        ...projectData,
        ...(clientId && { clientId }),
        ...(consultantId !== undefined && { consultantId }),
      });

      await queryRunner.manager.save(project);

      // Reload with relations
      const updatedProject = await queryRunner.manager.findOne(Project, {
        where: { id: project.id },
        relations: ['client', 'consultant'],
      });

      await queryRunner.commitTransaction();

      logger.info(`Project updated: ${project.id}`, {
        projectId: project.id,
        updatedFields: Object.keys(req.body),
      });

      res.json({
        success: true,
        data: updatedProject,
        message: 'Project updated successfully',
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
);

/**
 * Soft delete a project
 * @route DELETE /api/v1/projects/:id
 */
export const deleteProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const projectId = parseInt(id, 10);

    if (isNaN(projectId)) {
      throw new AppError('Invalid project ID', 400, 'INVALID_ID');
    }

    const projectRepository = AppDataSource.getRepository(Project);
    const project = await projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    // Soft delete
    await projectRepository.softRemove(project);

    logger.info(`Project soft deleted: ${project.id}`, {
      projectId: project.id,
      name: project.name,
    });

    res.status(204).send();
  }
);
