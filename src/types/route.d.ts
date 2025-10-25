import { RequestHandler, Router } from 'express';

export type TRoutes = {
  [path: string]: [...middlewares: RequestHandler[], router: Router];
};
