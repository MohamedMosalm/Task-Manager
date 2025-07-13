import { Router } from 'express';
import * as userController from '../controllers/userController';

const userRouter = Router();

userRouter.route('/register').post(userController.registerUser);
userRouter.route('/login').post(userController.loginUser);

export default userRouter;
