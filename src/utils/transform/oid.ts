import { ObjectId } from 'mongodb';
import ServerError from '../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';

export const oid = (str: string | null = null) => {
  if (!str?.trim()) return;

  if (!ObjectId.isValid(str as string))
    throw new ServerError(
      StatusCodes.BAD_REQUEST,
      str + ' is an invalid ObjectId',
    );

  return new ObjectId(str as string);
};
