import type z from 'zod';
import { UserValidations } from './User.validation';
import { User as TUser } from '../../../../prisma';

export type TUserZod = Partial<Record<keyof TUser, z.ZodTypeAny>>;

export type TUserRegister = z.infer<typeof UserValidations.register>['body'];
export type TUserEdit = z.infer<typeof UserValidations.edit>['body'];

export type TAgentRegister = z.infer<
  typeof UserValidations.agentRegister
>['body'];
