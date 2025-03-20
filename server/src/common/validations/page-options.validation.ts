import { z } from 'zod';

/**
 * Enum schema for validating the `orderBy` field in pagination options.
 *
 * Possible values:
 * - `'definition.item.id'`: Orders by the item ID.
 * - `'definition.item.baseParameters.itemTypeId'`: Orders by the item type ID.
 * - `'definition.item.title'`: Orders by the item title.
 *
 * This field is optional.
 */
const orderByEnum = z
  .enum([
    'definition.item.id',
    'definition.item.baseParameters.itemTypeId',
    'definition.item.title',
  ])
  .optional();

/**
 * Zod schema for validating pagination and sorting options.
 *
 * This schema ensures that:
 * - `take` (default: `10`) defines the number of items per page, with a minimum of `1` and a maximum of `100`.
 * - `order` (default: `'ASC'`) defines the sorting order (`'ASC'` or `'DESC'`).
 * - `orderBy` (optional) specifies the field by which items should be sorted.
 * - `page` (default: `1`, optional) defines the current page number, with a minimum value of `1`.
 */
export const PageOptionsDtoValidation = z.object({
  take: z.number().min(1).max(100).default(10),
  order: z.enum(['ASC', 'DESC']).default('ASC'),
  orderBy: orderByEnum,
  page: z.number().min(1).default(1).optional(),
});
