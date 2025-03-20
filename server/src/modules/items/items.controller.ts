import { Controller, Get, Param, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiPaginationQuery } from '../../common/decorators/pagination.decorator';
import { RetrieveItemDto } from './dto/retrieve-item.dto';
import { PaginatedResponse } from '../../common/types/response.type';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import {
  RetrieveItemFilter,
  RetrieveItemsFilterValidation,
} from './validations/items.validation';
import { PageOptionsDtoValidation } from '../../common/validations/page-options.validation';
import { handleZodValidation } from '../../common/validations/zod-error.helper';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all items' })
  @ApiQuery({
    name: 'itemTypeId',
    required: false,
    type: Number,
    description: 'Item type',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Title of the item',
  })
  @ApiQuery({ name: 'locale', required: true, example: 'fr' })
  @ApiPaginationQuery()
  @ApiResponse({
    status: 200,
    type: RetrieveItemDto,
  })
  async find(
    @Query() query: Partial<RetrieveItemFilter>,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PaginatedResponse<RetrieveItemDto>> {
    const validatedFilter = handleZodValidation(
      RetrieveItemsFilterValidation.safeParse(query),
      { message: 'Invalid query parameters', logError: true },
    );

    const validatedPageOptions = handleZodValidation(
      PageOptionsDtoValidation.safeParse(pageOptionsDto),
      { message: 'Invalid pagination parameters', logError: true },
    );

    const pageOptionsInstance = new PageOptionsDto(validatedPageOptions);
    const { data, itemCount, totalCount } = await this.itemsService.find(
      validatedFilter,
      pageOptionsInstance,
    );

    return { data, itemCount, totalCount, pageOptionsDto: pageOptionsInstance };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }
}
