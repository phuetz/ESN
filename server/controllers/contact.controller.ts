import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../data-source';
import { Contact } from '../entity/Contact';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { CreateContactDto, UpdateContactDto } from '../dto/contact.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const getContacts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { clientId, role, isPrimary, limit = '50', page = '1' } = req.query;

    const repository = AppDataSource.getRepository(Contact);
    const queryBuilder = repository.createQueryBuilder('contact')
      .leftJoinAndSelect('contact.client', 'client');

    if (clientId) {
      queryBuilder.andWhere('contact.clientId = :clientId', { clientId });
    }

    if (role) {
      queryBuilder.andWhere('contact.role = :role', { role });
    }

    if (isPrimary !== undefined) {
      queryBuilder.andWhere('contact.isPrimary = :isPrimary', { isPrimary: isPrimary === 'true' });
    }

    queryBuilder.andWhere('contact.deletedAt IS NULL');

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;
    queryBuilder.take(take).skip(skip).orderBy('contact.createdAt', 'DESC');

    const [contacts, total] = await queryBuilder.getManyAndCount();

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: parseInt(page as string, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  }
);

export const getContactById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Contact);
    const contact = await repository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['client', 'activities'],
    });

    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    res.json({
      success: true,
      data: contact,
    });
  }
);

export const createContact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(CreateContactDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Contact);
    const contact = repository.create(req.body);
    const saved = await repository.save(contact);

    logger.info(`Contact created: ${saved.firstName} ${saved.lastName}`);

    res.status(201).json({
      success: true,
      data: saved,
    });
  }
);

export const updateContact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const dto = plainToClass(UpdateContactDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new AppError('Validation failed', 400, errors);
    }

    const repository = AppDataSource.getRepository(Contact);
    const contact = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    Object.assign(contact, req.body);
    const saved = await repository.save(contact);

    logger.info(`Contact updated: ${saved.firstName} ${saved.lastName}`);

    res.json({
      success: true,
      data: saved,
    });
  }
);

export const deleteContact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const repository = AppDataSource.getRepository(Contact);
    const contact = await repository.findOne({ where: { id: parseInt(id, 10) } });

    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    await repository.softDelete(id);

    logger.info(`Contact deleted: ${contact.firstName} ${contact.lastName}`);

    res.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  }
);
