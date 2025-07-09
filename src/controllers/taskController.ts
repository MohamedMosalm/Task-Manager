import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { sendSuccessResponse } from '../utils/responseHandler';
import asyncWrapper from '../utils/asyncWrapper';
import { AppError } from '../middlewares/errorHandler';

const prismaClient = new PrismaClient();

const getAllTasks = asyncWrapper(async (_req: Request, res: Response) => {
  const tasks = await prismaClient.task.findMany();
  sendSuccessResponse(res, 200, 'Tasks fetched successfully', tasks);
});

const getTaskById = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;

  const task = await prismaClient.task.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  sendSuccessResponse(res, 200, 'Task fetched successfully', task);
});

const createTask = asyncWrapper(async (req: Request, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    throw new AppError('Title and content are required', 400);
  }

  const newTask = await prismaClient.task.create({
    data: {
      title,
      content,
    },
  });
  sendSuccessResponse(res, 201, 'Task created successfully', newTask);
});

const updateTask = asyncWrapper(async (req: Request, res: Response) => {
  const { title, content, completed } = req.body;
  const { id } = req.params;

  const updatedTask = await prismaClient.task.update({
    where: {
      id: parseInt(id),
    },
    data: {
      title,
      content,
      completed,
    },
  });
  sendSuccessResponse(res, 200, 'Task updated successfully', updatedTask);
});

const deleteTask = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prismaClient.task.delete({
    where: {
      id: parseInt(id),
    },
  });
  sendSuccessResponse(res, 204, 'Task Deleted Successfully');
});

export { getAllTasks, createTask, getTaskById, updateTask, deleteTask };
