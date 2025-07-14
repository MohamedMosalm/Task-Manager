import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import { sendSuccessResponse, setAuthCookies, clearAuthCookies } from '../utils/responseHandler';
import asyncWrapper from '../utils/asyncWrapper';
import { AppError } from '../middlewares/errorHandler';
// import { z } from 'zod';
import { comparePassword, hashPassword } from '../utils/passwordUtils';
import { generateTokenPair } from '../utils/jwtUtils';

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

  const tokenPair = generateTokenPair({ id: newUser.id, email: newUser.email });

  setAuthCookies(res, tokenPair);

  sendSuccessResponse(res, 201, 'User Registered Successfully', {
    user: {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    },
  });
});

const loginUser = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('All fields are required', 400);
  }
  //TODO: input validation using zod

  const user = await prismaClient.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isCorrectPassword = await comparePassword(password, user.hashedPassword);
  if (!isCorrectPassword) {
    throw new AppError('Invalid credentials', 401);
  }

  const tokenPair = generateTokenPair({ id: user.id, email: user.email });

  setAuthCookies(res, tokenPair);

  sendSuccessResponse(res, 200, 'User Logged In Successfully', {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
});

const logoutUser = asyncWrapper(async (_req: Request, res: Response) => {
  clearAuthCookies(res);
  sendSuccessResponse(res, 200, 'User Logged Out Successfully');
});

export { registerUser, loginUser, logoutUser };
