import type { ZodType } from 'zod';

/**
 * Zod schema for a model
 * @template Model The model to validate
 * @template Extra Extra fields to validate
 */
export type TModelZod<Model, Extra = unknown> = Partial<
  Record<keyof Model | Extra, ZodType>
>;
