import { prisma } from '.';
import type { TModels } from '../../types/db';

/**
 * Check if a document exists in the given model.
 *
 * @param model available models from db
 * @returns (id: string) => Promise<TModel>
 */
export const exists =
  (model: TModels) =>
  async (id: string | null = null) => {
    if (id) {
      return (prisma[model] as any).findUnique({
        where: { id },
        select: { id: true }, //? skip body
      });
    }
  };
