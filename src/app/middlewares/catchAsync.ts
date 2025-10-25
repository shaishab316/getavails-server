/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import serveResponse, {
  TServeResponse,
} from '../../utils/server/serveResponse';

type AsyncHandler<T = any> = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction,
) =>
  | void
  | Partial<TServeResponse<T>>
  | Promise<void | Partial<TServeResponse<T>>>;

/**
 * Wraps an Express request handler to catch and handle async errors
 *
 * @param fn - The Express request handler function to wrap
 * @returns A wrapped request handler that catches async errors
 */
const catchAsync = <T = any>(
  fn: AsyncHandler<T>,
  errFn: ErrorRequestHandler | null = null,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await fn(req, res, next);
      if (result) serveResponse(res, result);
    } catch (error) {
      if (errFn) await (errFn(error, req, res, next) as any);
      else next(error);
    }
  };
};

export default catchAsync;
