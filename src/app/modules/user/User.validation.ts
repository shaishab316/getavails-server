import { z } from 'zod';
import { EGender, EUserRole, User as TUser } from '../../../../prisma';
import { enum_encode } from '../../../utils/transform/enum';
import { TModelZod } from '../../../types/zod';

export const UserValidations = {
  register: z.object({
    body: z.object({
      email: z.email({ error: 'Email is invalid' }),
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

  // Done
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
      experience: z
        .string({ error: 'Experience is required' })
        .nonempty('Experience is required'),
      location: z
        .string({ error: 'Location is required' })
        .nonempty('Location is required'),
      price: z.coerce
        .string({ error: 'Price is required' })
        .nonempty('Price is required'),
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
      venue_capacity: z.coerce
        .number({ error: 'Venue capacity is required' })
        .min(1, 'Venue capacity is required'),
      venue_type: z
        .string({ error: 'Venue type is required' })
        .nonempty('Venue type is required'),
      location: z
        .string({ error: 'Location is required' })
        .nonempty('Location is required'),
    } satisfies TModelZod<TUser, 'venue_capacity' | 'venue_type'>),
  }),

  // Done
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
      genre: z
        .string({ error: 'Genre is required' })
        .nonempty('Genre is required'),
      price: z.coerce
        .string({ error: 'Price is required' })
        .nonempty('Price is required'),
      location: z
        .string({ error: 'Location is required' })
        .nonempty('Location is required'),
    } satisfies TModelZod<TUser>),
  }),

  // Issue
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
      looking_for: z
        .string({ error: 'Looking for category is required' })
        .nonempty('Looking for category is required'),
      location: z
        .string({ error: 'Location is required' })
        .nonempty('Location is required'),
    } satisfies TModelZod<TUser, 'looking_for'>),
  }),
};
