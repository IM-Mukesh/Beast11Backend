import { Request, Response } from 'express';

export class BaseController {
  protected successResponse(res: Response, data: any, message: string = 'Success', statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  protected errorResponse(res: Response, error: any, statusCode: number = 500): void {
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }

  protected validateRequest(req: Request, res: Response, schema: any): boolean {
    const { error } = schema.validate(req.body);
    if (error) {
      this.errorResponse(res, { message: error.details[0].message }, 400);
      return false;
    }
    return true;
  }
} 