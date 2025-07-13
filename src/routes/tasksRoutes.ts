import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import authMiddleware from '../middlewares/authMiddleware';

const taskRouter = Router();

taskRouter.route('/').get(authMiddleware, taskController.getAllTasks).post(authMiddleware, taskController.createTask);

taskRouter.route('/:id').get(authMiddleware, taskController.getTaskById).patch(authMiddleware, taskController.updateTask).delete(authMiddleware, taskController.deleteTask);

export default taskRouter;
