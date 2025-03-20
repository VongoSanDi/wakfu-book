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
export const LocaleFilterValidation = z.enum(['fr', 'en', 'es', 'pt']);

/**
 * Type representing the validated action retrieval filter.
 *
 * This type is inferred from `RetrieveActionsFilterValidation`, ensuring that
 * all properties conform to the defined Zod schema.
 */
export type LocaleFilter = z.infer<typeof LocaleFilterValidation>;
