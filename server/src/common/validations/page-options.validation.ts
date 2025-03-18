import { z } from 'zod';
import { PageOptionsDto } from '../dto/page-options.dto';
import { ValidateSchema } from './validators';

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

// Create an instance of PageOptionsDto so it can run through the constructor and calculate the skip automatically
// Without this, it returns plain object(without functions or getters) and don't pass through the getter
export function validatePageOptionsDto(
  dto: Partial<PageOptionsDto>,
): PageOptionsDto {
  const validatedDto = ValidateSchema<PageOptionsDto>(
    PageOptionsDtoValidation,
    dto,
  );
  return new PageOptionsDto(validatedDto);
}
