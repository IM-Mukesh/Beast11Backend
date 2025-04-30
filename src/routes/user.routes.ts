import { Router, Request, Response, NextFunction } from 'express';
import { validateUser, validateUserInput, sanitizeInput } from '../middleware';

const router = Router();

// Example route with multiple validation layers
router.post('/register',
  sanitizeInput,
  ...validateUserInput,
  validateUser,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Your route handler logic here
      // The request body is now validated and sanitized
      res.status(201).json({ 
        message: 'User registered successfully',
        data: {
          email: req.body.email,
          username: req.body.username,
          role: req.body.role
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Example route for updating user profile
router.put('/profile',
  sanitizeInput,
  validateUser,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Your profile update logic here
      res.status(200).json({ 
        message: 'Profile updated successfully',
        data: {
          email: req.body.email,
          username: req.body.username,
          phone: req.body.phone
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 