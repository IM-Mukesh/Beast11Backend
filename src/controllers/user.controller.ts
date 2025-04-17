import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { UserService } from '../services/user.service';
import { authenticateUser } from '../middleware/auth';

type RouteConfig = {
  path: string;
  method: string;
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  middleware: ((req: Request, res: Response, next: NextFunction) => void)[];
};

export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const user = await this.userService.getUserProfile(userId);
      this.successResponse(res, user);
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const profileData = req.body;
      const updatedUser = await this.userService.updateUserProfile(userId, profileData);
      this.successResponse(res, updatedUser);
    } catch (error) {
      next(error);
    }
  };

  public getRoutes(): RouteConfig[] {
    return [
      {
        path: '/profile',
        method: 'get',
        handler: this.getProfile,
        middleware: [authenticateUser]
      },
      {
        path: '/profile',
        method: 'put',
        handler: this.updateProfile,
        middleware: [authenticateUser]
      }
    ];
  }
} 