import { z } from 'zod';
import { EGender, EUserRole, User } from '../../../../prisma';
import { enum_encode } from '../../../utils/transform/enum';

export const UserValidations = {
  register: z.object({
    body: z.object({
      email: z.email({ error: 'Email is invalid' }),
      role: z.enum(EUserRole).optional(),
      password: z
        .string({ error: 'Password is missing' })
        .min(6, 'Password must be at least 6 characters long'),
    } satisfies Partial<Record<keyof User, z.ZodTypeAny>>),
  }),

  edit: z.object({
    body: z.object({
      role: z.enum(EUserRole).optional(),
      name: z.string().optional(),
      avatar: z
        .string()
        .nullable()
        .transform(val => val ?? undefined),
      country: z.string().optional(),
      gender: z.enum(EGender).optional(),
    } satisfies Partial<Record<keyof User, z.ZodTypeAny>>),
  }),

  changePassword: z.object({
    body: z.object({
      oldPassword: z
        .string({
          error: 'Old Password is missing',
        })
        .min(1, 'Old Password is required')
        .min(6, 'Old Password must be at least 6 characters long'),
      newPassword: z
        .string({
          error: 'New Password is missing',
        })
        .min(1, 'New Password is required')
        .min(6, 'New Password must be at least 6 characters long'),
    }),
  }),

  getAllUser: z.object({
    query: z.object({
      search: z.string().trim().optional(),
      role: z
        .string()
        .optional()
        .transform(enum_encode)
        .pipe(z.enum(EUserRole).optional()),
    }),
  }),
};
