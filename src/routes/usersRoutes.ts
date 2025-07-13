import { Router } from 'express';
import * as userController from '../controllers/userController';

const userRouter = Router();

userRouter.route('/register').post(userController.registerUser);

export default userRouter;
