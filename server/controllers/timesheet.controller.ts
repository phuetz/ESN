import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Timesheet } from '../entity/Timesheet';
import { TimesheetStatus } from '../entity/Timesheet';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { CreateTimesheetDto, UpdateTimesheetDto } from '../dto/timesheet.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const getTimesheets = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { consultantId, missionId, status, startDate, endDate, limit = '50', page = '1' } = req.query;

    const repository = AppDataSource.getRepository(Timesheet);
    const queryBuilder = repository.createQueryBuilder('timesheet')
      .leftJoinAndSelect('timesheet.consultant', 'consultant')
      .leftJoinAndSelect('timesheet.mission', 'mission')
      .leftJoinAndSelect('timesheet.approvedBy', 'approvedBy');

    if (consultantId) {
      queryBuilder.andWhere('timesheet.consultantId = :consultantId', { consultantId });
    }

    if (missionId) {
      queryBuilder.andWhere('timesheet.missionId = :missionId', { missionId });
    }

    if (status) {
      queryBuilder.andWhere('timesheet.status = :status', { status });
    }

    if (startDate) {
      queryBuilder.andWhere('timesheet.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('timesheet.date <= :endDate', { endDate });
    }

    queryBuilder.andWhere('timesheet.deletedAt IS NULL');

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;
    queryBuilder.take(take).skip(skip).orderBy('timesheet.date', 'DESC');

    const [timesheets, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: timesheets,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getTimesheetById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Timesheet);
    const timesheet = await repository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['consultant', 'mission', 'approvedBy'],
    });

    if (!timesheet) {
      throw new AppError('Timesheet not found', 404);
    }

    res.json({
      success: true,
      data: timesheet,
    });
  }
);

export const createTimesheet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(CreateTimesheetDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Timesheet);
    const timesheet = repository.create(req.body);
    const saved = await repository.save(timesheet);

    logger.info(`Timesheet created for consultant ID: ${saved.consultantId}, date: ${saved.date}`);

    res.status(201).json({
      success: true,
      data: saved,
    });
  }
);

export const updateTimesheet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const dto = plainToClass(UpdateTimesheetDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Timesheet);
    const timesheet = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!timesheet) {
      throw new AppError('Timesheet not found', 404);
    }

    Object.assign(timesheet, req.body);
    const saved = await repository.save(timesheet);

    logger.info(`Timesheet updated: ${saved.id}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

export const deleteTimesheet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Timesheet);
    const timesheet = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!timesheet) {
      throw new AppError('Timesheet not found', 404);
    }

    await repository.softDelete(id);

    logger.info(`Timesheet deleted: ${timesheet.id}`);

    res.json({
      success: true,
      message: 'Timesheet deleted successfully',
    });
  }
);

/**
 * Approve a timesheet
 */
export const approveTimesheet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { approvedById } = req.body;

    const repository = AppDataSource.getRepository(Timesheet);
    const timesheet = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!timesheet) {
      throw new AppError('Timesheet not found', 404);
    }

    if (timesheet.status !== TimesheetStatus.SUBMITTED) {
      throw new AppError('Only submitted timesheets can be approved', 400);
    }

    timesheet.status = TimesheetStatus.APPROVED;
    timesheet.approvedById = approvedById;
    timesheet.approvedAt = new Date();

    const saved = await repository.save(timesheet);

    logger.info(`Timesheet approved: ${saved.id} by user ${approvedById}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

/**
 * Reject a timesheet
 */
export const rejectTimesheet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { approvedById, rejectionReason } = req.body;

    const repository = AppDataSource.getRepository(Timesheet);
    const timesheet = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!timesheet) {
      throw new AppError('Timesheet not found', 404);
    }

    if (timesheet.status !== TimesheetStatus.SUBMITTED) {
      throw new AppError('Only submitted timesheets can be rejected', 400);
    }

    timesheet.status = TimesheetStatus.REJECTED;
    timesheet.approvedById = approvedById;
    timesheet.rejectionReason = rejectionReason;
    timesheet.approvedAt = new Date();

    const saved = await repository.save(timesheet);

    logger.info(`Timesheet rejected: ${saved.id} by user ${approvedById}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

/**
 * Get timesheet statistics for hours summary
 */
export const getTimesheetStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { consultantId, missionId, startDate, endDate } = req.query;

    const repository = AppDataSource.getRepository(Timesheet);
    const queryBuilder = repository.createQueryBuilder('timesheet');

    queryBuilder.select('timesheet.status', 'status');
    queryBuilder.addSelect('COUNT(*)', 'count');
    queryBuilder.addSelect('SUM(timesheet.hours)', 'totalHours');
    queryBuilder.addSelect('SUM(CASE WHEN timesheet.isBillable = true THEN timesheet.hours ELSE 0 END)', 'billableHours');
    queryBuilder.addSelect('SUM(CASE WHEN timesheet.isOvertime = true THEN timesheet.hours ELSE 0 END)', 'overtimeHours');

    if (consultantId) {
      queryBuilder.andWhere('timesheet.consultantId = :consultantId', { consultantId });
    }

    if (missionId) {
      queryBuilder.andWhere('timesheet.missionId = :missionId', { missionId });
    }

    if (startDate) {
      queryBuilder.andWhere('timesheet.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('timesheet.date <= :endDate', { endDate });
    }

    queryBuilder.andWhere('timesheet.deletedAt IS NULL');
    queryBuilder.groupBy('timesheet.status');

    const stats = await queryBuilder.getRawMany();

    // Get overall stats
    const overallQuery = repository.createQueryBuilder('timesheet');
    overallQuery.select('COUNT(*)', 'totalEntries');
    overallQuery.addSelect('SUM(timesheet.hours)', 'totalHours');
    overallQuery.addSelect('SUM(CASE WHEN timesheet.isBillable = true THEN timesheet.hours ELSE 0 END)', 'billableHours');
    overallQuery.addSelect('SUM(CASE WHEN timesheet.isOvertime = true THEN timesheet.hours ELSE 0 END)', 'overtimeHours');

    if (consultantId) {
      overallQuery.andWhere('timesheet.consultantId = :consultantId', { consultantId });
    }

    if (missionId) {
      overallQuery.andWhere('timesheet.missionId = :missionId', { missionId });
    }

    if (startDate) {
      overallQuery.andWhere('timesheet.date >= :startDate', { startDate });
    }

    if (endDate) {
      overallQuery.andWhere('timesheet.date <= :endDate', { endDate });
    }

    overallQuery.andWhere('timesheet.deletedAt IS NULL');

    const overall = await overallQuery.getRawOne();

    res.json({
      success: true,
      data: {
        byStatus: stats,
        overall,
      },
    });
  }
);
