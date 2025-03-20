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
  itemTypeId: z.number().int().positive().optional(),
  title: z.string().optional(),
});

/**
 * Type representing the validated item retrieval filter.
 *
 * This type is inferred from `RetrieveItemsFilterValidation`, ensuring that
 * all properties conform to the defined Zod schema.
 */
export type RetrieveItemFilter = z.infer<typeof RetrieveItemsFilterValidation>;
