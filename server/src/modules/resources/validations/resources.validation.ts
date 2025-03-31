import { z } from 'zod';

/**
 * Zod schema for validating resource retrieval filters.
 *
 * This schema ensures that:
 * - `id` is a positive integer.
 */
export const RetrieveResourcesFilterValidation = z.object({
  resourceType: z.number().int().positive().optional()
});

/**
 * Type representing the validated resource retrieval filter.
 *
 * This type is inferred from `RetrieveResourcesFilterValidation`, ensuring that
 * all properties conform to the defined Zod schema.
 */
export type RetrieveResourceFilter = z.infer<
  typeof RetrieveResourcesFilterValidation
>;
