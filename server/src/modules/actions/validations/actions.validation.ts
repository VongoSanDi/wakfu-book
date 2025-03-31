import { z } from 'zod';

/**
 * Zod schema for validating action retrieval filters.
 *
 * This schema ensures that:
 * - `id` is a positive integer.
 */
export const RetrieveActionsFilterValidation = z.object({
  id: z.number().int().positive().optional(),
});

/**
 * Type representing the validated action retrieval filter.
 *
 * This type is inferred from `RetrieveActionsFilterValidation`, ensuring that
 * all properties conform to the defined Zod schema.
 */
export type RetrieveActionFilter = z.infer<
  typeof RetrieveActionsFilterValidation
>;
