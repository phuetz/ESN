import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppDataSource from '../data-source';
import { User, UserRole } from '../entity/User';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import config from '../config';
import logger from '../utils/logger';

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.CONSULTANT,
    });

    await userRepository.save(user);

    logger.info(`New user registered: ${email}`);

    // Generate token
    const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
        token,
      },
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    // Find user
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Update last login
    user.lastLoginAt = new Date();
    await userRepository.save(user);

    logger.info(`User logged in: ${email}`);

    // Generate token
    const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        token,
      },
    });
  }
);

export const getProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    res.json({
      success: true,
      data: user.toJSON(),
    });
  }
);
