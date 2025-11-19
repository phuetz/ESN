import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppDataSource from '../data-source';
import { User, UserRole } from '../entity/User';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import config from '../config';
import logger from '../utils/logger';

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password strength
const isStrongPassword = (password: string): boolean => {
  // Enforce password requirements:
  // - Minimum 8 characters, maximum 72 (bcrypt limit)
  // - Contains uppercase, lowercase, number, and special character
  if (password.length < 8 || password.length > 72) {
    return false;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
};

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 */
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      throw new AppError(
        'Email, password, first name, and last name are required',
        400,
        'MISSING_FIELDS'
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      throw new AppError('Invalid email format', 400, 'INVALID_EMAIL');
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      throw new AppError(
        'Password must be 8-72 characters and contain uppercase, lowercase, number, and special character (!@#$%^&* etc.)',
        400,
        'WEAK_PASSWORD'
      );
    }

    // Use transaction for data integrity
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepository = AppDataSource.getRepository(User);

      // Check if user already exists
      const existingUser = await queryRunner.manager.findOne(User, {
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        throw new AppError(
          'User with this email already exists',
          409,
          'USER_EXISTS'
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = userRepository.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        role: UserRole.CONSULTANT,
      });

      const savedUser = await queryRunner.manager.save(user);

      // Generate access token
      const token = jwt.sign(
        { userId: savedUser.id },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
      );

      // Generate refresh token
      const refreshToken = jwt.sign(
        { userId: savedUser.id, type: 'refresh' },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions
      );

      // Store refresh token in database
      savedUser.refreshToken = refreshToken;
      await queryRunner.manager.save(savedUser);

      await queryRunner.commitTransaction();

      logger.info(`New user registered: ${email}`, {
        userId: savedUser.id,
        role: savedUser.role,
      });

      res.status(201).json({
        success: true,
        data: {
          user: savedUser.toJSON(),
          token,
          refreshToken,
        },
        message: 'User registered successfully',
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
 * Login user
 * @route POST /api/v1/auth/login
 */
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      throw new AppError(
        'Email and password are required',
        400,
        'MISSING_CREDENTIALS'
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      throw new AppError('Invalid email format', 400, 'INVALID_EMAIL');
    }

    const userRepository = AppDataSource.getRepository(User);

    // Find user (always search by lowercase email)
    const user = await userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Use same error message to prevent email enumeration
      logger.warn(`Failed login attempt for non-existent user: ${email}`, {
        ip: req.ip,
      });
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Check if user is active
    if (!user.isActive) {
      logger.warn(`Login attempt for deactivated account: ${email}`, {
        userId: user.id,
        ip: req.ip,
      });
      throw new AppError('Account is deactivated', 403, 'ACCOUNT_DEACTIVATED');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Failed login attempt with incorrect password: ${email}`, {
        userId: user.id,
        ip: req.ip,
      });
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Use transaction to ensure consistency
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update last login
      user.lastLoginAt = new Date();

      // Generate access token
      const token = jwt.sign(
        { userId: user.id },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
      );

      // Generate refresh token
      const refreshToken = jwt.sign(
        { userId: user.id, type: 'refresh' },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions
      );

      // Store refresh token in database
      user.refreshToken = refreshToken;
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      logger.info(`User logged in successfully: ${email}`, {
        userId: user.id,
        role: user.role,
      });

      res.json({
        success: true,
        data: {
          user: user.toJSON(),
          token,
          refreshToken,
        },
        message: 'Login successful',
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
);

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('User not found', 401);
    }

    res.json({
      success: true,
      data: req.user.toJSON(),
    });
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
        userId: number;
        type: string;
      };

      if (decoded.type !== 'refresh') {
        throw new AppError('Invalid token type', 401);
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: decoded.userId, isActive: true, refreshToken },
      });

      if (!user) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new access token
      const newToken = jwt.sign(
        { userId: user.id },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
      );

      // Generate new refresh token
      const newRefreshToken = jwt.sign(
        { userId: user.id, type: 'refresh' },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions
      );

      // Update refresh token in database
      user.refreshToken = newRefreshToken;
      await userRepository.save(user);

      logger.info(`Token refreshed for user: ${user.email}`);

      res.json({
        success: true,
        data: {
          token: newToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid or expired refresh token', 401);
      }
      throw error;
    }
  }
);

export const logout = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('User not found', 401);
    }

    const userRepository = AppDataSource.getRepository(User);

    // Invalidate refresh token
    req.user.refreshToken = undefined;
    await userRepository.save(req.user);

    logger.info(`User logged out: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  }
);
