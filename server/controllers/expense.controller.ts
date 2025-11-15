import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Expense } from '../entity/Expense';
import { ExpenseStatus } from '../entity/Expense';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { CreateExpenseDto, UpdateExpenseDto } from '../dto/expense.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const getExpenses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { consultantId, status, projectId, category, limit = '50', page = '1' } = req.query;

    const repository = AppDataSource.getRepository(Expense);
    const queryBuilder = repository.createQueryBuilder('expense')
      .leftJoinAndSelect('expense.consultant', 'consultant')
      .leftJoinAndSelect('expense.project', 'project')
      .leftJoinAndSelect('expense.approvedBy', 'approvedBy');

    if (consultantId) {
      queryBuilder.andWhere('expense.consultantId = :consultantId', { consultantId });
    }

    if (status) {
      queryBuilder.andWhere('expense.status = :status', { status });
    }

    if (projectId) {
      queryBuilder.andWhere('expense.projectId = :projectId', { projectId });
    }

    if (category) {
      queryBuilder.andWhere('expense.category = :category', { category });
    }

    queryBuilder.andWhere('expense.deletedAt IS NULL');

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;
    queryBuilder.take(take).skip(skip).orderBy('expense.expenseDate', 'DESC');

    const [expenses, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: expenses,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getExpenseById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Expense);
    const expense = await repository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['consultant', 'project', 'approvedBy'],
    });

    if (!expense) {
      throw new AppError('Expense not found', 404);
    }

    res.json({
      success: true,
      data: expense,
    });
  }
);

export const createExpense = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(CreateExpenseDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Expense);
    const expense = repository.create(req.body);
    const saved = await repository.save(expense);

    logger.info(`Expense created: ${saved.title}`);

    res.status(201).json({
      success: true,
      data: saved,
    });
  }
);

export const updateExpense = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const dto = plainToClass(UpdateExpenseDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Expense);
    const expense = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!expense) {
      throw new AppError('Expense not found', 404);
    }

    Object.assign(expense, req.body);
    const saved = await repository.save(expense);

    logger.info(`Expense updated: ${saved.title}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

export const deleteExpense = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Expense);
    const expense = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!expense) {
      throw new AppError('Expense not found', 404);
    }

    await repository.softDelete(id);

    logger.info(`Expense deleted: ${expense.title}`);

    res.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  }
);

/**
 * Approve an expense
 */
export const approveExpense = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { approvedById } = req.body;

    const repository = AppDataSource.getRepository(Expense);
    const expense = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!expense) {
      throw new AppError('Expense not found', 404);
    }

    if (expense.status !== ExpenseStatus.SUBMITTED) {
      throw new AppError('Only submitted expenses can be approved', 400);
    }

    expense.status = ExpenseStatus.APPROVED;
    expense.approvedById = approvedById;
    expense.approvedAt = new Date();

    const saved = await repository.save(expense);

    logger.info(`Expense approved: ${saved.title} by user ${approvedById}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

/**
 * Reject an expense
 */
export const rejectExpense = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { approvedById, rejectionReason } = req.body;

    const repository = AppDataSource.getRepository(Expense);
    const expense = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!expense) {
      throw new AppError('Expense not found', 404);
    }

    if (expense.status !== ExpenseStatus.SUBMITTED) {
      throw new AppError('Only submitted expenses can be rejected', 400);
    }

    expense.status = ExpenseStatus.REJECTED;
    expense.approvedById = approvedById;
    expense.rejectionReason = rejectionReason;
    expense.approvedAt = new Date();

    const saved = await repository.save(expense);

    logger.info(`Expense rejected: ${saved.title} by user ${approvedById}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);
