import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

/**
 * Custom decorator that applies pagination query parameters to Swagger documentation.
 *
 * This decorator adds the following query parameters:
 * - `skip`: Number of elements to skip (optional).
 * - `take`: Number of elements to return (optional).
 * - `page`: Page number (optional).
 * - `order`: Sorting direction (`ASC` or `DESC`) (optional).
 * - `orderBy`: Column used for sorting (optional).
 *
 * @example
 * ```
 * /items?take=10&page=2&order=ASC&orderBy=definition.item.id
 * ```
 */
export const ApiPaginationQuery = (): MethodDecorator & ClassDecorator => {
  return applyDecorators(
    ApiQuery({
      name: 'take',
      required: false,
      description: 'Number of element to return',
      type: Number,
    }),

    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number',
      type: Number,
    }),

    ApiQuery({
      name: 'order',
      required: false,
      description: 'Specify the sorting direction',
      type: String,
    }),
    ApiQuery({
      name: 'orderBy',
      required: false,
      description: 'Specify the column on which we want to sort',
      type: Number,
    }),
  );
};
