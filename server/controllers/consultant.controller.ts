import { Request, Response, NextFunction } from 'express';
import { Like } from 'typeorm';
import AppDataSource from '../data-source';
import { Consultant } from '../entity/Consultant';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';

/**
 * Get all consultants with filtering, searching and pagination
 * @route GET /api/v1/consultants
 * @query {string} status - Filter by consultant status (ACTIVE, BENCH, INACTIVE)
 * @query {string} search - Search in firstName, lastName, email
 * @query {number} limit - Number of results per page (default: 50, max: 100)
 * @query {number} page - Page number (default: 1)
 */
export const getConsultants = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, search, limit = '50', page = '1' } = req.query;

    // Validate and sanitize pagination parameters
    const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100); // Max 100 per page
    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1); // Min page 1

    if (isNaN(limitNum) || isNaN(pageNum)) {
      throw new AppError('Invalid pagination parameters', 400, 'INVALID_PAGINATION');
    }

    const consultantRepository = AppDataSource.getRepository(Consultant);
    const queryBuilder = consultantRepository.createQueryBuilder('consultant');

    // Apply filters
    if (status) {
      // Validate status value
      const validStatuses = ['ACTIVE', 'BENCH', 'INACTIVE'];
      if (!validStatuses.includes(status as string)) {
        throw new AppError('Invalid status value', 400, 'INVALID_STATUS');
      }
      queryBuilder.andWhere('consultant.status = :status', { status });
    }

    if (search) {
      // Sanitize search input to prevent SQL injection
      const sanitizedSearch = (search as string).replace(/[%_]/g, '\\$&');
      queryBuilder.andWhere(
        '(consultant.firstName LIKE :search OR consultant.lastName LIKE :search OR consultant.email LIKE :search)',
        { search: `%${sanitizedSearch}%` }
      );
    }

    // Soft delete filter
    queryBuilder.andWhere('consultant.deletedAt IS NULL');

    // Pagination
    const skip = (pageNum - 1) * limitNum;
    queryBuilder.take(limitNum).skip(skip);

    // Add ordering for consistent results
    queryBuilder.orderBy('consultant.createdAt', 'DESC');

    // Get results with count
    const startTime = Date.now();
    const [consultants, total] = await queryBuilder.getManyAndCount();
    const queryTime = Date.now() - startTime;

    logger.info(`Fetched ${consultants.length} consultants in ${queryTime}ms`, {
      page: pageNum,
      limit: limitNum,
      total,
    });

    res.json({
      success: true,
      data: consultants,
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
 * Get a single consultant by ID
 * @route GET /api/v1/consultants/:id
 */
export const getConsultantById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const consultantId = parseInt(id, 10);

    if (isNaN(consultantId)) {
      throw new AppError('Invalid consultant ID', 400, 'INVALID_ID');
    }

    const consultantRepository = AppDataSource.getRepository(Consultant);
    const consultant = await consultantRepository.findOne({
      where: { id: consultantId },
      relations: ['projects', 'projects.client'],
    });

    if (!consultant) {
      throw new AppError('Consultant not found', 404, 'CONSULTANT_NOT_FOUND');
    }

    res.json({
      success: true,
      data: consultant,
    });
  }
);

/**
 * Create a new consultant
 * @route POST /api/v1/consultants
 */
export const createConsultant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const consultantRepository = AppDataSource.getRepository(Consultant);

    // Check for duplicate email
    if (req.body.email) {
      const existingConsultant = await consultantRepository.findOne({
        where: { email: req.body.email },
      });

      if (existingConsultant) {
        throw new AppError(
          'A consultant with this email already exists',
          409,
          'DUPLICATE_EMAIL'
        );
      }
    }

    // Use transaction for data integrity
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const consultant = consultantRepository.create(req.body);
      const savedConsultant = (await queryRunner.manager.save(
        consultant
      )) as unknown as Consultant;

      await queryRunner.commitTransaction();

      logger.info(
        `Consultant created: ${savedConsultant.firstName} ${savedConsultant.lastName} (ID: ${savedConsultant.id})`,
        {
          consultantId: savedConsultant.id,
          email: savedConsultant.email,
        }
      );

      res.status(201).json({
        success: true,
        data: savedConsultant,
        message: 'Consultant created successfully',
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
 * Update an existing consultant
 * @route PUT /api/v1/consultants/:id
 */
export const updateConsultant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const consultantId = parseInt(id, 10);

    if (isNaN(consultantId)) {
      throw new AppError('Invalid consultant ID', 400, 'INVALID_ID');
    }

    const consultantRepository = AppDataSource.getRepository(Consultant);

    // Use transaction for data integrity
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let consultant = await queryRunner.manager.findOne(Consultant, {
        where: { id: consultantId },
      });

      if (!consultant) {
        throw new AppError('Consultant not found', 404, 'CONSULTANT_NOT_FOUND');
      }

      // Check for duplicate email if email is being updated
      if (req.body.email && req.body.email !== consultant.email) {
        const existingConsultant = await queryRunner.manager.findOne(Consultant, {
          where: { email: req.body.email },
        });

        if (existingConsultant) {
          throw new AppError(
            'A consultant with this email already exists',
            409,
            'DUPLICATE_EMAIL'
          );
        }
      }

      consultant = consultantRepository.merge(consultant, req.body);
      await queryRunner.manager.save(consultant);

      await queryRunner.commitTransaction();

      logger.info(`Consultant updated: ${consultant.id}`, {
        consultantId: consultant.id,
        updatedFields: Object.keys(req.body),
      });

      res.json({
        success: true,
        data: consultant,
        message: 'Consultant updated successfully',
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
 * Soft delete a consultant
 * @route DELETE /api/v1/consultants/:id
 */
export const deleteConsultant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const consultantId = parseInt(id, 10);

    if (isNaN(consultantId)) {
      throw new AppError('Invalid consultant ID', 400, 'INVALID_ID');
    }

    const consultantRepository = AppDataSource.getRepository(Consultant);
    const consultant = await consultantRepository.findOne({
      where: { id: consultantId },
    });

    if (!consultant) {
      throw new AppError('Consultant not found', 404, 'CONSULTANT_NOT_FOUND');
    }

    // Soft delete
    await consultantRepository.softRemove(consultant);

    logger.info(`Consultant soft deleted: ${consultant.id}`, {
      consultantId: consultant.id,
      email: consultant.email,
    });

    res.status(204).send();
  }
);
