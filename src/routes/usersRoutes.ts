import { Router } from 'express';
import * as userController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';
import { validateBody } from '../middlewares/validationMiddleware';
import { userRegistrationSchema, userLoginSchema } from '../validation/validation';

const userRouter = Router();

userRouter.route('/register').post(validateBody(userRegistrationSchema), userController.registerUser);

userRouter.route('/login').post(validateBody(userLoginSchema), userController.loginUser);

userRouter.route('/logout').post(authMiddleware, userController.logoutUser);

export default userRouter;
