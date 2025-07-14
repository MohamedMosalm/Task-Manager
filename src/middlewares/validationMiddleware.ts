import { Request, Response, NextFunction } from 'express';
import { z, ZodIssue } from 'zod';
import { AppError } from './errorHandler';

const validateBody = (schema: z.ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const errors = result.error.issues.map((err: ZodIssue) => ({
          field: err.path.join('.') || 'body',
          message: err.message,
        }));
        throw new AppError(`Validation failed: ${errors.map((e: { field: string; message: string }) => `${e.field}: ${e.message}`).join(', ')}`, 400);
      }
      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }

    const result = schema.safeParse(req.body);
    if (result.success) {
      console.log('Valid user:', result.data);
    } else {
      console.error('Validation errors:', result.error.format());
    }
  };
};

export { validateBody };
