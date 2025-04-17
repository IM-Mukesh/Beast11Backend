import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/database';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
} 