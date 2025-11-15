import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Leave } from '../entity/Leave';
import { LeaveStatus } from '../entity/Leave';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { CreateLeaveDto, UpdateLeaveDto } from '../dto/leave.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const getLeaves = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { consultantId, status, type, limit = '50', page = '1' } = req.query;

    const repository = AppDataSource.getRepository(Leave);
    const queryBuilder = repository.createQueryBuilder('leave')
      .leftJoinAndSelect('leave.consultant', 'consultant')
      .leftJoinAndSelect('leave.approvedBy', 'approvedBy');

    if (consultantId) {
      queryBuilder.andWhere('leave.consultantId = :consultantId', { consultantId });
    }

    if (status) {
      queryBuilder.andWhere('leave.status = :status', { status });
    }

    if (type) {
      queryBuilder.andWhere('leave.type = :type', { type });
    }

    queryBuilder.andWhere('leave.deletedAt IS NULL');

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;
    queryBuilder.take(take).skip(skip).orderBy('leave.startDate', 'DESC');

    const [leaves, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: leaves,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getLeaveById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Leave);
    const leave = await repository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['consultant', 'approvedBy'],
    });

    if (!leave) {
      throw new AppError('Leave not found', 404);
    }

    res.json({
      success: true,
      data: leave,
    });
  }
);

export const createLeave = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(CreateLeaveDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Leave);
    const leave = repository.create(req.body);
    const saved = await repository.save(leave);

    logger.info(`Leave created for consultant ID: ${saved.consultantId}`);

    res.status(201).json({
      success: true,
      data: saved,
    });
  }
);

export const updateLeave = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const dto = plainToClass(UpdateLeaveDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Leave);
    const leave = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!leave) {
      throw new AppError('Leave not found', 404);
    }

    Object.assign(leave, req.body);
    const saved = await repository.save(leave);

    logger.info(`Leave updated: ${saved.id}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

export const deleteLeave = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Leave);
    const leave = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!leave) {
      throw new AppError('Leave not found', 404);
    }

    await repository.softDelete(id);

    logger.info(`Leave deleted: ${leave.id}`);

    res.json({
      success: true,
      message: 'Leave deleted successfully',
    });
  }
);

/**
 * Approve a leave request
 */
export const approveLeave = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { approvedById } = req.body;

    const repository = AppDataSource.getRepository(Leave);
    const leave = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!leave) {
      throw new AppError('Leave not found', 404);
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new AppError('Only pending leaves can be approved', 400);
    }

    leave.status = LeaveStatus.APPROVED;
    leave.approvedById = approvedById;
    leave.approvedAt = new Date();

    const saved = await repository.save(leave);

    logger.info(`Leave approved: ${saved.id} by user ${approvedById}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

/**
 * Reject a leave request
 */
export const rejectLeave = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { approvedById, rejectionReason } = req.body;

    const repository = AppDataSource.getRepository(Leave);
    const leave = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!leave) {
      throw new AppError('Leave not found', 404);
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new AppError('Only pending leaves can be rejected', 400);
    }

    leave.status = LeaveStatus.REJECTED;
    leave.approvedById = approvedById;
    leave.rejectionReason = rejectionReason;
    leave.approvedAt = new Date();

    const saved = await repository.save(leave);

    logger.info(`Leave rejected: ${saved.id} by user ${approvedById}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);
