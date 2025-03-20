import { z } from 'zod';

const localeValidation = z.enum(['fr', 'en', 'es', 'pt']);

// Used for validating the incoming dto
export const RetrieveItemsFilterValidation = z.object({
  itemTypeId: z.number().int().positive().optional(),
  locale: localeValidation,
  title: z.string().optional(),
});

// Used as filter/dto
export type RetrieveItemFilter = z.infer<typeof RetrieveItemsFilterValidation>;
