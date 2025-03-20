import { z } from 'zod';

const orderByEnum = z
  .enum([
    'definition.item.id',
    'definition.item.baseParameters.itemTypeId',
    'definition.item.title',
  ])
  .optional();

export const PageOptionsDtoValidation = z.object({
  take: z.number().min(1).max(100).default(10),
  skip: z.number().min(0).default(0),
  order: z.enum(['ASC', 'DESC']).default('ASC'),
  orderBy: orderByEnum,
  page: z.number().min(1).default(1).optional(),
});
