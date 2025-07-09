import express from 'express';
import taskRouter from './routes/tasksRoutes';
import { sendErrorResponse } from './utils/responseHandler';

const app = express();

app.use(express.json());

const apiPrefix = process.env.API_PREFIX || '/api/v1';

app.use(`${apiPrefix}/tasks`, taskRouter);

app.all('*', (req, res) => {
  sendErrorResponse(res, 404, `Can't find ${req.originalUrl} on this server!`);
});

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
