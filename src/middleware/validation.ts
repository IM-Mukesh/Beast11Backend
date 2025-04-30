import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// User validation schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional(),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

// Contest validation schemas
export const contestSchema = z.object({
  name: z.string()
    .min(3, 'Contest name must be at least 3 characters')
    .max(100, 'Contest name must not exceed 100 characters'),
  entryFee: z.number()
    .positive('Entry fee must be positive')
    .min(0, 'Entry fee cannot be negative'),
  prizePool: z.number()
    .positive('Prize pool must be positive')
    .min(0, 'Prize pool cannot be negative'),
  maxParticipants: z.number()
    .positive('Max participants must be positive')
    .int('Max participants must be an integer'),
  startTime: z.string().datetime('Invalid start time'),
  endTime: z.string().datetime('Invalid end time'),
  status: z.enum(['UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED']).default('UPCOMING'),
  type: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
});

// Team validation schemas
export const teamSchema = z.object({
  name: z.string()
    .min(3, 'Team name must be at least 3 characters')
    .max(50, 'Team name must not exceed 50 characters'),
  players: z.array(z.object({
    playerId: z.string().uuid('Invalid player ID format'),
    isCaptain: z.boolean(),
    isViceCaptain: z.boolean(),
  }))
  .min(1, 'Team must have at least one player')
  .max(11, 'Team cannot have more than 11 players'),
  contestId: z.string().uuid('Invalid contest ID format'),
});

// Transaction validation schemas
export const transactionSchema = z.object({
  amount: z.number()
    .positive('Amount must be positive')
    .min(0, 'Amount cannot be negative'),
  type: z.enum(['DEPOSIT', 'WITHDRAWAL', 'CONTEST_ENTRY', 'WINNING']),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']),
  userId: z.string().uuid('Invalid user ID format'),
  contestId: z.string().uuid('Invalid contest ID format').optional(),
});

// Generic validation middleware using Zod
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }
      next(error);
    }
  };
};

// Express-validator middleware for additional validation
export const validateUserInput = [
  body('email').isEmail().normalizeEmail(),
  body('password').isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  }),
  body('username').trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('phone').optional().matches(/^\+?[1-9]\d{1,14}$/),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  }
];

// Sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  const sanitizeString = (str: string) => {
    return str
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove potential JavaScript protocol
      .replace(/on\w+=/gi, '') // Remove potential event handlers
      .trim();
  };

  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      } else if (Array.isArray(req.body[key])) {
        req.body[key] = req.body[key].map((item: any) => 
          typeof item === 'string' ? sanitizeString(item) : item
        );
      }
    });
  }

  next();
};

// Export validation middleware for specific routes
export const validateUser = validate(userSchema);
export const validateContest = validate(contestSchema);
export const validateTeam = validate(teamSchema);
export const validateTransaction = validate(transactionSchema); 