import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prismaClient = new PrismaClient();

const getAllTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await prismaClient.task.findMany();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { getAllTasks };
