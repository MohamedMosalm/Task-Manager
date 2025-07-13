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

  const token = generateToken({ id: newUser.id, email: newUser.email });

  sendSuccessResponse(res, 201, 'User Registered Successfully', {
    token,
  });
});

export { registerUser };
