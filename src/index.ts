import express, { Request, Response } from 'express';
import taskRouter from './routes/tasksRoutes';
import userRouter from './routes/usersRoutes';
import { sendErrorResponse } from './utils/responseHandler';
import { globalErrorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

const apiPrefix = process.env.API_PREFIX || '/api/v1';

app.use(`${apiPrefix}/tasks`, taskRouter);
app.use(`${apiPrefix}/users`, userRouter);

app.all('*', (req: Request, res: Response) => {
  sendErrorResponse(res, 404, `Can't find ${req.originalUrl} on this server!`);
});

app.use(globalErrorHandler);

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
