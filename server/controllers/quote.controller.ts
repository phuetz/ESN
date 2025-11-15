import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Quote } from '../entity/Quote';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { CreateQuoteDto, UpdateQuoteDto } from '../dto/quote.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

/**
 * Generate a unique quote number in the format Q-YYYY-NNN
 */
export const generateQuoteNumber = async (): Promise<string> => {
  const repository = AppDataSource.getRepository(Quote);
  const currentYear = new Date().getFullYear();

  // Find the last quote for this year
  const lastQuote = await repository
    .createQueryBuilder('quote')
    .where('quote.quoteNumber LIKE :pattern', { pattern: `Q-${currentYear}-%` })
    .orderBy('quote.quoteNumber', 'DESC')
    .getOne();

  let nextNumber = 1;
  if (lastQuote) {
    const lastNumber = parseInt(lastQuote.quoteNumber.split('-')[2], 10);
    nextNumber = lastNumber + 1;
  }

  return `Q-${currentYear}-${nextNumber.toString().padStart(3, '0')}`;
};

/**
 * Calculate quote totals from items
 */
const calculateQuoteTotals = (items: any[], taxRate: number, discount: number = 0) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.unitPrice) * parseFloat(item.quantity));
  }, 0);

  const discountedSubtotal = subtotal - discount;
  const taxAmount = (discountedSubtotal * taxRate) / 100;
  const total = discountedSubtotal + taxAmount;

  return {
    subtotal,
    taxAmount,
    total,
  };
};

export const getQuotes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, clientId, limit = '50', page = '1' } = req.query;

    const repository = AppDataSource.getRepository(Quote);
    const queryBuilder = repository.createQueryBuilder('quote')
      .leftJoinAndSelect('quote.client', 'client')
      .leftJoinAndSelect('quote.createdBy', 'createdBy')
      .leftJoinAndSelect('quote.opportunity', 'opportunity');

    if (status) {
      queryBuilder.andWhere('quote.status = :status', { status });
    }

    if (clientId) {
      queryBuilder.andWhere('quote.clientId = :clientId', { clientId });
    }

    queryBuilder.andWhere('quote.deletedAt IS NULL');

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;
    queryBuilder.take(take).skip(skip).orderBy('quote.createdAt', 'DESC');

    const [quotes, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: quotes,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getQuoteById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Quote);
    const quote = await repository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['client', 'createdBy', 'opportunity', 'items'],
    });

    if (!quote) {
      throw new AppError('Quote not found', 404);
    }

    res.json({
      success: true,
      data: quote,
    });
  }
);

export const createQuote = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(CreateQuoteDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    // Generate quote number if not provided
    if (!req.body.quoteNumber) {
      req.body.quoteNumber = await generateQuoteNumber();
    }

    // Calculate totals from items if provided
    if (req.body.items && req.body.items.length > 0) {
      const totals = calculateQuoteTotals(
        req.body.items,
        req.body.taxRate || 0,
        req.body.discount || 0
      );
      req.body.subtotal = totals.subtotal;
      req.body.taxAmount = totals.taxAmount;
      req.body.total = totals.total;
    }

    const repository = AppDataSource.getRepository(Quote);
    const quote = repository.create(req.body);
    const saved = await repository.save(quote);

    logger.info(`Quote created: ${saved.quoteNumber}`);

    res.status(201).json({
      success: true,
      data: saved,
    });
  }
);

export const updateQuote = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const dto = plainToClass(UpdateQuoteDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Quote);
    const quote = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!quote) {
      throw new AppError('Quote not found', 404);
    }

    // Recalculate totals from items if provided
    if (req.body.items && req.body.items.length > 0) {
      const totals = calculateQuoteTotals(
        req.body.items,
        req.body.taxRate !== undefined ? req.body.taxRate : quote.taxRate,
        req.body.discount !== undefined ? req.body.discount : quote.discount
      );
      req.body.subtotal = totals.subtotal;
      req.body.taxAmount = totals.taxAmount;
      req.body.total = totals.total;
    }

    Object.assign(quote, req.body);
    const saved = await repository.save(quote);

    logger.info(`Quote updated: ${saved.quoteNumber}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

export const deleteQuote = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Quote);
    const quote = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!quote) {
      throw new AppError('Quote not found', 404);
    }

    await repository.softDelete(id);

    logger.info(`Quote deleted: ${quote.quoteNumber}`);

    res.json({
      success: true,
      message: 'Quote deleted successfully',
    });
  }
);
