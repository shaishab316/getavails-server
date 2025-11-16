import { z } from 'zod';
import {
  ESubscriptionInterval,
  Subscription as TSubscription,
} from '../../../../prisma';
import { enum_encode } from '../../../utils/transform/enum';
import { TModelZod } from '../../../types/zod';
import { exists } from '../../../utils/db/exists';

export const SubscriptionValidations = {
  createSubscription: z.object({
    body: z.object({
      name: z
        .string({ error: 'Name is missing' })
        .trim()
        .nonempty('Name is required'),
      price: z.coerce
        .number({ error: 'Price is missing' })
        .min(1, 'Price must be greater than 0'),
      subscription_interval: z
        .string({ error: 'Interval is missing' })
        .trim()
        .transform(enum_encode)
        .pipe(z.enum(ESubscriptionInterval)),
      features: z
        .array(
          z
            .string({
              error: 'Feature is missing',
            })
            .trim()
            .nonempty('Feature is required'),
        )
        .nonempty('Features are required'),
      isHot: z.coerce.boolean().optional(),
    }),
  }),

  editSubscription: z.object({
    body: z.object({
      subscription_id: z.string().refine(exists('subscription'), {
        error: ({ input }) => `Subscription with ID ${input} does not exist`,
      }),
      name: z.string().optional(),
      price: z.coerce.number().optional(),
      subscription_interval: z
        .string()
        .optional()
        .transform(enum_encode)
        .pipe(z.enum(ESubscriptionInterval)),
      features: z.array(z.string()).optional(),
      isHot: z.coerce.boolean().optional(),
    } satisfies TModelZod<TSubscription, 'subscription_id'>),
  }),

  getAvailableSubscriptions: z.object({
    query: z.object({
      subscription_interval: z
        .string()
        .transform(enum_encode)
        .pipe(z.enum(ESubscriptionInterval).optional())
        .optional(),
      minPrice: z.coerce.number().optional(),
      maxPrice: z.coerce.number().optional(),
    }),
  }),

  deleteSubscription: z.object({
    body: z.object({
      subscription_id: z.string().refine(exists('subscription'), {
        error: ({ input }) => `Subscription with ID ${input} does not exist`,
      }),
    }),
  }),
};
