import { Router } from 'express';
import * as userController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const userRouter = Router();

userRouter.route('/register').post(userController.registerUser);
userRouter.route('/login').post(userController.loginUser);
userRouter.route('/logout').post(authMiddleware, userController.logoutUser);

export default userRouter;
