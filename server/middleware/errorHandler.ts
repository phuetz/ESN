import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;
  let errorCode = 'INTERNAL_SERVER_ERROR';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
    errorCode = err.code || 'APP_ERROR';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    errorCode = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Unauthorized';
    errorCode = 'UNAUTHORIZED';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    errorCode = 'TOKEN_EXPIRED';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format';
    errorCode = 'INVALID_FORMAT';
  } else if (err.name === 'QueryFailedError') {
    statusCode = 400;
    message = 'Database query failed';
    errorCode = 'QUERY_FAILED';
  } else if (err.message) {
    message = err.message;
  }

  // Enhanced error logging with more context
  const errorLog = {
    timestamp: new Date().toISOString(),
    level: statusCode >= 500 ? 'error' : 'warn',
    message: err.message,
    code: errorCode,
    statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get('user-agent'),
    userId: (req as any).user?.id,
    stack: err.stack,
    isOperational,
    requestBody: process.env.NODE_ENV === 'development' ? req.body : undefined,
    requestQuery: process.env.NODE_ENV === 'development' ? req.query : undefined,
  };

  if (statusCode >= 500) {
    logger.error('Server error:', errorLog);
  } else {
    logger.warn('Client error:', errorLog);
  }

  // Don't expose internal errors to clients in production
  const clientMessage =
    process.env.NODE_ENV === 'production' && statusCode >= 500
      ? 'An unexpected error occurred'
      : message;

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: clientMessage,
      code: errorCode,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err,
        originalMessage: message,
      }),
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};

// Catch async errors
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};
