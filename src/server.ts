import express, { Request, Response, NextFunction, Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { UserController } from './controllers/user.controller';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize controllers
const userController = new UserController();

// Define route type
type RouteConfig = {
  path: string;
  method: string;
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  middleware: ((req: Request, res: Response, next: NextFunction) => void)[];
};

// Register routes
userController.getRoutes().forEach((route: RouteConfig) => {
  const router = express.Router();
  const method = route.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch';
  
  // Create a wrapper function to ensure proper typing
  const handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await route.handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  router[method](route.path, ...route.middleware, handler);
  app.use('/api/users', router);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
