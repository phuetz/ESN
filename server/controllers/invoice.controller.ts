import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Invoice } from '../entity/Invoice';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../dto/invoice.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

/**
 * Generate a unique invoice number in the format INV-YYYY-NNN
 */
export const generateInvoiceNumber = async (): Promise<string> => {
  const repository = AppDataSource.getRepository(Invoice);
  const currentYear = new Date().getFullYear();

  // Find the last invoice for this year
  const lastInvoice = await repository
    .createQueryBuilder('invoice')
    .where('invoice.invoiceNumber LIKE :pattern', { pattern: `INV-${currentYear}-%` })
    .orderBy('invoice.invoiceNumber', 'DESC')
    .getOne();

  let nextNumber = 1;
  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[2], 10);
    nextNumber = lastNumber + 1;
  }

  return `INV-${currentYear}-${nextNumber.toString().padStart(3, '0')}`;
};

/**
 * Calculate invoice totals from items
 */
const calculateInvoiceTotals = (items: any[], taxRate: number, discount: number = 0, amountPaid: number = 0) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.unitPrice) * parseFloat(item.quantity));
  }, 0);

  const discountedSubtotal = subtotal - discount;
  const taxAmount = (discountedSubtotal * taxRate) / 100;
  const total = discountedSubtotal + taxAmount;
  const amountDue = total - amountPaid;

  return {
    subtotal,
    taxAmount,
    total,
    amountDue,
  };
};

export const getInvoices = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, clientId, projectId, limit = '50', page = '1' } = req.query;

    const repository = AppDataSource.getRepository(Invoice);
    const queryBuilder = repository.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.client', 'client')
      .leftJoinAndSelect('invoice.project', 'project')
      .leftJoinAndSelect('invoice.createdBy', 'createdBy');

    if (status) {
      queryBuilder.andWhere('invoice.status = :status', { status });
    }

    if (clientId) {
      queryBuilder.andWhere('invoice.clientId = :clientId', { clientId });
    }

    if (projectId) {
      queryBuilder.andWhere('invoice.projectId = :projectId', { projectId });
    }

    queryBuilder.andWhere('invoice.deletedAt IS NULL');

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;
    queryBuilder.take(take).skip(skip).orderBy('invoice.createdAt', 'DESC');

    const [invoices, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: invoices,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getInvoiceById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Invoice);
    const invoice = await repository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['client', 'project', 'createdBy', 'items'],
    });

    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }

    res.json({
      success: true,
      data: invoice,
    });
  }
);

export const createInvoice = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(CreateInvoiceDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    // Generate invoice number if not provided
    if (!req.body.invoiceNumber) {
      req.body.invoiceNumber = await generateInvoiceNumber();
    }

    // Calculate totals from items if provided
    if (req.body.items && req.body.items.length > 0) {
      const totals = calculateInvoiceTotals(
        req.body.items,
        req.body.taxRate || 20,
        req.body.discount || 0,
        req.body.amountPaid || 0
      );
      req.body.subtotal = totals.subtotal;
      req.body.taxAmount = totals.taxAmount;
      req.body.total = totals.total;
      req.body.amountDue = totals.amountDue;
    }

    const repository = AppDataSource.getRepository(Invoice);
    const invoice = repository.create(req.body);
    const saved = await repository.save(invoice);

    logger.info(`Invoice created: ${saved.invoiceNumber}`);

    res.status(201).json({
      success: true,
      data: saved,
    });
  }
);

export const updateInvoice = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const dto = plainToClass(UpdateInvoiceDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Invoice);
    const invoice = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }

    // Recalculate totals from items if provided
    if (req.body.items && req.body.items.length > 0) {
      const totals = calculateInvoiceTotals(
        req.body.items,
        req.body.taxRate !== undefined ? req.body.taxRate : invoice.taxRate,
        req.body.discount !== undefined ? req.body.discount : invoice.discount,
        req.body.amountPaid !== undefined ? req.body.amountPaid : invoice.amountPaid
      );
      req.body.subtotal = totals.subtotal;
      req.body.taxAmount = totals.taxAmount;
      req.body.total = totals.total;
      req.body.amountDue = totals.amountDue;
    }

    Object.assign(invoice, req.body);
    const saved = await repository.save(invoice);

    logger.info(`Invoice updated: ${saved.invoiceNumber}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

export const deleteInvoice = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Invoice);
    const invoice = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }

    await repository.softDelete(id);

    logger.info(`Invoice deleted: ${invoice.invoiceNumber}`);

    res.json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  }
);

/**
 * Get invoice statistics for revenue reporting
 */
export const getInvoiceStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const repository = AppDataSource.getRepository(Invoice);

    const stats = await repository
      .createQueryBuilder('invoice')
      .select('invoice.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(invoice.total)', 'totalAmount')
      .addSelect('SUM(invoice.amountPaid)', 'totalPaid')
      .addSelect('SUM(invoice.amountDue)', 'totalDue')
      .where('invoice.deletedAt IS NULL')
      .groupBy('invoice.status')
      .getRawMany();

    // Get overall stats
    const overall = await repository
      .createQueryBuilder('invoice')
      .select('COUNT(*)', 'totalInvoices')
      .addSelect('SUM(invoice.total)', 'totalRevenue')
      .addSelect('SUM(invoice.amountPaid)', 'totalPaid')
      .addSelect('SUM(invoice.amountDue)', 'totalOutstanding')
      .where('invoice.deletedAt IS NULL')
      .getRawOne();

    res.json({
      success: true,
      data: {
        byStatus: stats,
        overall,
      },
    });
  }
);
