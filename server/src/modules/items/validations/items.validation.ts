import { z } from 'zod';

const localeValidation = z.enum(['fr', 'en', 'es', 'pt']);

export const RetrieveItemsFilterValidation = z.object({
  itemTypeId: z.number().int().positive(),
  locale: localeValidation,
  title: z.string().optional(),
});
