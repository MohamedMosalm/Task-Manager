import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import { sendSuccessResponse } from '../utils/responseHandler';
import asyncWrapper from '../utils/asyncWrapper';
import { AppError } from '../middlewares/errorHandler';
// import { z } from 'zod';
import { hashPassword } from '../utils/passwordUtils';
import { generateToken } from '../utils/jwtUtils';

const prismaClient = new PrismaClient();

const registerUser = asyncWrapper(async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = req.body;

  if (!email || !firstName || !lastName || !password) {
    throw new AppError('All fields are required', 400);
  }
  //TODO: input validation using zod

  const oldUser = await prismaClient.user.findUnique({
    where: { email },
  });

  if (oldUser) {
    throw new AppError('User already exists', 400);
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prismaClient.user.create({
    data: {
      firstName,
      lastName,
      email,
      hashedPassword,
    },
  });

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessTokenSecret) {
    throw new AppError('ACCESS_TOKEN_SECRET environment variable is not set', 500);
  }

  const accessTokenTTL = process.env.ACCESS_TOKEN_TTL ? parseInt(process.env.ACCESS_TOKEN_TTL) : 86400; // 1 day

  const accessToken = generateToken({ id: newUser.id, email: newUser.email }, accessTokenSecret, accessTokenTTL);

  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!refreshTokenSecret) {
    throw new AppError('REFRESH_TOKEN_SECRET environment variable is not set', 500);
  }

  const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL ? parseInt(process.env.REFRESH_TOKEN_TTL) : 604800; // 7 days

  const refreshToken = generateToken({ id: newUser.id, email: newUser.email }, refreshTokenSecret, refreshTokenTTL);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: accessTokenTTL * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: refreshTokenTTL * 1000,
  });

  sendSuccessResponse(res, 201, 'User Registered Successfully', {
    user: {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    },
  });
});

export { registerUser };
