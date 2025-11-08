import { ZodError } from 'zod';
import { TErrorMessage } from '../types/errors';
import { StatusCodes } from 'http-status-codes';

const handleZodError = ({ issues }: ZodError) => {
  const errorMessages: TErrorMessage[] = issues.map(({ path, message }) => ({
    path: path[path.length - 1] as string,
    message,
  }));

  return {
    success: false,
    statusCode: StatusCodes.BAD_REQUEST,
    message: 'Request validation error',
    errorMessages,
  };
};

export default handleZodError;
