import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AppError } from './errorHandler';
import config from '../config';

/**
 * CSRF Protection Middleware
 *
 * Implements Double Submit Cookie pattern for CSRF protection:
 * 1. Server generates a random token and sends it as a cookie
 * 2. Client must include the same token in a custom header
 * 3. Server validates that cookie token === header token
 *
 * This works because:
 * - Attackers can't read cookies due to SameSite and domain restrictions
 * - Attackers can't set custom headers in cross-origin requests
 * - Only legitimate requests from our domain can include both cookie and header
 */

const CSRF_COOKIE_NAME = 'csrfToken';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32;

/**
 * Generate a cryptographically secure random CSRF token
 */
export const generateCsrfToken = (): string => {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
};

/**
 * Set CSRF token as httpOnly cookie
 * This should be called on routes that render pages or on initial auth
 */
export const setCsrfToken = (req: Request, res: Response) => {
  const isProduction = config.node_env === 'production';

  // Generate new token if it doesn't exist
  let token = req.cookies?.[CSRF_COOKIE_NAME];

  if (!token) {
    token = generateCsrfToken();

    // Set as httpOnly cookie (prevents XSS access)
    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: true, // Prevents JavaScript access
      secure: isProduction, // Only HTTPS in production
      sameSite: 'strict', // Prevents CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/',
    });
  }

  // Also send in response header so client can read it for subsequent requests
  // (client will send this back in X-CSRF-Token header)
  res.setHeader('X-CSRF-Token', token);

  return token;
};

/**
 * Middleware to generate and set CSRF token on GET requests
 * This ensures clients always have a valid token
 */
export const csrfTokenGenerator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only generate token on GET requests (safe methods)
  if (req.method === 'GET') {
    setCsrfToken(req, res);
  }
  next();
};

/**
 * Middleware to validate CSRF token on unsafe HTTP methods
 * Validates the Double Submit Cookie pattern
 */
export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only validate on unsafe methods (POST, PUT, DELETE, PATCH)
  const unsafeMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

  if (!unsafeMethods.includes(req.method)) {
    return next();
  }

  // Skip CSRF validation for auth endpoints (they use other protection mechanisms)
  // Login/Register don't have a token yet, but are protected by rate limiting
  const exemptPaths = [
    '/api/v1/auth/login',
    '/api/v1/auth/register',
  ];

  if (exemptPaths.some(path => req.path === path)) {
    return next();
  }

  // Get token from cookie
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];

  // Get token from header
  const headerToken = req.headers[CSRF_HEADER_NAME.toLowerCase()] as string;

  // Validate both tokens exist
  if (!cookieToken || !headerToken) {
    throw new AppError(
      'CSRF token missing. Please refresh the page.',
      403,
      'CSRF_TOKEN_MISSING'
    );
  }

  // Validate tokens match (constant-time comparison to prevent timing attacks)
  const tokensMatch = crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(headerToken)
  );

  if (!tokensMatch) {
    throw new AppError(
      'Invalid CSRF token. Please refresh the page.',
      403,
      'CSRF_TOKEN_INVALID'
    );
  }

  // Token is valid, proceed
  next();
};

/**
 * Endpoint to get a fresh CSRF token
 * Frontend can call this to get a token before making requests
 */
export const getCsrfToken = (req: Request, res: Response) => {
  const token = setCsrfToken(req, res);

  res.json({
    success: true,
    data: {
      csrfToken: token,
    },
    message: 'CSRF token generated',
  });
};
