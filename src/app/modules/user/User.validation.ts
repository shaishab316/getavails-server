import { z } from 'zod';
import { EGender, EUserRole } from '../../../../prisma';
import { enum_encode } from '../../../utils/transform/enum';
import { TUserZod } from './User.interface';

export const UserValidations = {
  register: z.object({
    body: z.object({
      email: z.email({ error: 'Email is invalid' }),
      role: z.enum(EUserRole).optional(),
      password: z
        .string({ error: 'Password is missing' })
        .min(6, 'Password must be at least 6 characters long'),
    } satisfies TUserZod),
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
    } satisfies TUserZod),
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

  agentRegister: z.object({
    body: z.object({
      name: z
        .string({ error: 'Name is required' })
        .nonempty('Name is required'),
      email: z.email({ error: 'Email is invalid' }),
      password: z
        .string({ error: 'Password is missing' })
        .min(6, 'Password must be at least 6 characters long')
        .max(30, 'Password must be at most 30 characters long'),
      country: z
        .string({ error: 'Country is required' })
        .nonempty('Country is required'),
      experience: z
        .string({ error: 'Experience is required' })
        .nonempty('Experience is required'),
    } satisfies TUserZod),
  }),
};
