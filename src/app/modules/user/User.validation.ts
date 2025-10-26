import { z } from 'zod';
import { EGender, EUserRole, User as TUser } from '../../../../prisma';
import { enum_encode } from '../../../utils/transform/enum';
import { TModelZod } from '../../../types/zod';

export const UserValidations = {
  register: z.object({
    body: z.object({
      email: z.email({ error: 'Email is invalid' }),
      role: z.enum(EUserRole).optional(),
      password: z
        .string({ error: 'Password is missing' })
        .min(6, 'Password must be at least 6 characters long'),
    } satisfies TModelZod<TUser>),
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
    } satisfies TModelZod<TUser>),
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
    } satisfies TModelZod<TUser>),
  }),

  venueRegister: z.object({
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
      venue_capacity: z.coerce
        .number({ error: 'Venue capacity is required' })
        .min(1, 'Venue capacity is required'),
      venue_type: z
        .string({ error: 'Venue type is required' })
        .nonempty('Venue type is required'),
    } satisfies TModelZod<TUser, 'venue_capacity' | 'venue_type'>),
  }),

  artistRegister: z.object({
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
      category: z
        .string({ error: 'Category is required' })
        .nonempty('Category is required'),
      price: z.coerce
        .number({ error: 'Price is required' })
        .min(1, 'Price is required'),
    } satisfies TModelZod<TUser, 'category' | 'price'>),
  }),

  organizerRegister: z.object({
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
      looking_for: z
        .string({ error: 'Looking for category is required' })
        .nonempty('Looking for category is required'),
    } satisfies TModelZod<TUser, 'looking_for'>),
  }),
};
