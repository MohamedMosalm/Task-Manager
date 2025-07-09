import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/responseHandler';

class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleOperationalError = (err: any, res: Response) => {
  sendErrorResponse(res, err.statusCode, err.message);
};

const handlePrismaError = (err: any, res: Response) => {
  console.error('Prisma Error:', err);

  switch (err.code) {
    case 'P2002':
      sendErrorResponse(res, 409, 'Unique constraint violation');
      break;
    case 'P2025':
      sendErrorResponse(res, 404, 'Record not found');
      break;
    case 'P2003':
      sendErrorResponse(res, 400, 'Foreign key constraint violation');
      break;
    default:
      sendErrorResponse(res, 500, 'Database error');
      break;
  }
};

const handleUnexpectedError = (err: Error, res: Response) => {
  console.error('Programming Error:', err);
  sendErrorResponse(res, 500, 'Something went wrong!', err.message ? err.message : 'Internal Server Error');
};

const globalErrorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  err.statusCode = err.statusCode || 500;

  console.error(`Error ${err.statusCode}: ${err.message}`);
  console.error(err.stack);

  if (err.isOperational) {
    handleOperationalError(err, res);
  } else if (err.name && err.name.includes('Prisma')) {
    handlePrismaError(err, res);
  } else {
    handleUnexpectedError(err, res);
  }
};

export { AppError, globalErrorHandler };
