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

const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tasks = await prismaClient.task.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export { getAllTasks, createTask, getTaskById };
