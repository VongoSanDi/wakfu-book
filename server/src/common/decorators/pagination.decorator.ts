import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiPaginationQuery = () => {
  return applyDecorators(
    ApiQuery({
      name: 'skip',
      required: false,
      description: 'Number of element to skip',
      type: Number,
    }),
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
