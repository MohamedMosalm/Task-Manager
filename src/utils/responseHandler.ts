import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errorDetails?: string;
}

const sendSuccessResponse = <T>(res: Response, statusCode: number, message: string, data?: T): void => {
  const response: ApiResponse<T> = {
    success: true,
    statusCode,
    message,
    data,
  };

  res.status(statusCode).json(response);
};

const sendErrorResponse = (res: Response, statusCode: number, message: string, errorDetails?: string): void => {
  const response: ApiResponse<never> = {
    success: false,
    statusCode,
    message,
    errorDetails,
  };

  res.status(statusCode).json(response);
};

export { sendSuccessResponse, sendErrorResponse };
