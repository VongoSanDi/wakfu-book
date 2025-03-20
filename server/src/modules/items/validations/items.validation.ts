import { z } from 'zod';

/**
 * Enum schema for validating supported locales.
 *
 * Supported values:
 * - `'fr'` (French)
 * - `'en'` (English)
 * - `'es'` (Spanish)
 * - `'pt'` (Portuguese)
 */
const localeValidation = z.enum(['fr', 'en', 'es', 'pt']);

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
  locale: localeValidation,
  title: z.string().optional(),
});

/**
 * Type representing the validated item retrieval filter.
 *
 * This type is inferred from `RetrieveItemsFilterValidation`, ensuring that
 * all properties conform to the defined Zod schema.
 */
export type RetrieveItemFilter = z.infer<typeof RetrieveItemsFilterValidation>;
