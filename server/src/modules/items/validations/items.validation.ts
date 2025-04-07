import { z } from 'zod';

/**
 * Zod schema for validating item retrieval filters.
 *
 * This schema ensures that:
 * - `itemTypeId` (optional) is a positive integer.
 * - `locale` is a required enum value among `'fr'`, `'en'`, `'es'`, or `'pt'`.
 * - `title` (optional) is a string.
 */
export const RetrieveItemsFilterValidation = z.object({
  itemTypeId: z.coerce.number().optional(), // Convert this parameter send as string by client since it's the normal way for HTTP request
  title: z.string().optional(),
  levelMin: z.coerce.number().min(1).optional(),
  levelMax: z.coerce.number().optional(),
}).refine(
  (data) =>
    data.levelMin === undefined ||
    data.levelMax === undefined ||
    data.levelMin < data.levelMax,
  {
    message: 'levelMin must be less than levelMax',
    path: ['levelMin'],
  }
);;

/**
 * Type representing the validated item retrieval filter.
 *
 * This type is inferred from `RetrieveItemsFilterValidation`, ensuring that
 * all properties conform to the defined Zod schema.
 */
export type RetrieveItemFilter = z.infer<typeof RetrieveItemsFilterValidation>;
