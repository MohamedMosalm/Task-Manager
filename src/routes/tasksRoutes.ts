import { Router } from 'express';
import * as taskController from '../controllers/taskController';

const taskRouter = Router();

taskRouter.route('/').get(taskController.getAllTasks).post(taskController.createTask);

taskRouter.route('/:id').get(taskController.getTaskById).patch(taskController.updateTask);

export default taskRouter;
