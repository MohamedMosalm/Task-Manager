import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseHandler';

const prismaClient = new PrismaClient();

const getAllTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await prismaClient.task.findMany();
    sendSuccessResponse(res, 200, 'Tasks fetched successfully', tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    sendErrorResponse(res, 500, 'Internal Server Error', error instanceof Error ? error.message : 'Unknown Error');
  }
};

const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prismaClient.task.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    sendSuccessResponse(res, 200, 'Task fetched successfully', task);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      sendErrorResponse(res, 404, 'Task not found');
    }
    console.error('Error fetching tasks:', error);
    sendErrorResponse(res, 500, 'Internal Server Error', error instanceof Error ? error.message : 'Unknown Error');
  }
};

const createTask = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  try {
    const newTask = await prismaClient.task.create({
      data: {
        title,
        content,
      },
    });
    sendSuccessResponse(res, 201, 'Task created successfully', newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    sendErrorResponse(res, 500, 'Internal Server Error', error instanceof Error ? error.message : 'Unknown Error');
  }
};

const updateTask = async (req: Request, res: Response) => {
  const { title, content, completed } = req.body;
  const { id } = req.params;

  try {
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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      sendErrorResponse(res, 404, 'Task not found');
    }
    console.error('Error updating task:', error);
    sendErrorResponse(res, 500, 'Internal Server Error', error instanceof Error ? error.message : 'Unknown Error');
  }
};

const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prismaClient.task.delete({
      where: {
        id: parseInt(id),
      },
    });
    sendSuccessResponse(res, 204, 'Task Deleted Successfully');
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      sendErrorResponse(res, 404, 'Task not found');
    }
    console.error('Error deleteing task:', error);
    sendErrorResponse(res, 500, 'Internal Server Error', error instanceof Error ? error.message : 'Unknown Error');
  }
};

export { getAllTasks, createTask, getTaskById, updateTask, deleteTask };
