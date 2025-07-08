import express from 'express';
import taskRouter from './routes/tasksRoutes';

const app = express();

app.use(express.json());

const apiPrefix = process.env.API_PREFIX || '/api/v1';

app.use(`${apiPrefix}/tasks`, taskRouter);

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
