import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import authMiddleware from '../middlewares/authMiddleware';

const taskRouter = Router();

taskRouter.use(authMiddleware);

taskRouter.route('/').get(taskController.getAllTasks).post(taskController.createTask);

taskRouter.route('/:id').get(taskController.getTaskById).patch(taskController.updateTask).delete(taskController.deleteTask);

export default taskRouter;
