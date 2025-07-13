import { Response } from 'express';
import { TokenPair } from './jwtUtils';

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

const setAuthCookies = (res: Response, tokenPair: TokenPair): void => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  res.cookie('accessToken', tokenPair.accessToken, {
    ...cookieOptions,
    maxAge: tokenPair.accessTokenTTL * 1000,
  });

  res.cookie('refreshToken', tokenPair.refreshToken, {
    ...cookieOptions,
    maxAge: tokenPair.refreshTokenTTL * 1000,
  });
};

const clearAuthCookies = (res: Response): void => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

export { sendSuccessResponse, sendErrorResponse, setAuthCookies, clearAuthCookies };
