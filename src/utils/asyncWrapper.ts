import { Request, Response, NextFunction, RequestHandler } from 'express';

const asyncWrapper = (asyncFn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(asyncFn(req, res, next)).catch((err) => next(err));
  };
};

export default asyncWrapper;
