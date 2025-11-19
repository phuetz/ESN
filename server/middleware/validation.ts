import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { AppError } from './errorHandler';

export const validateDto = <T extends object>(dtoClass: ClassConstructor<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoInstance = plainToInstance(dtoClass, req.body);
      const errors: ValidationError[] = await validate(dtoInstance);

      if (errors.length > 0) {
        const messages = errors.map((error) => {
          return Object.values(error.constraints || {}).join(', ');
        });

        throw new AppError(`Validation failed: ${messages.join('; ')}`, 400);
      }

      req.body = dtoInstance;
      next();
    } catch (error) {
      next(error);
    }
  };
};
