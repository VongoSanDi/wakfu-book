import { Controller, Get, Param, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
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
import { LocaleFilterValidation } from '../../common/validations/locale-validation';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @Get(':locale')
  @ApiOperation({ summary: 'Retrieve items' })
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
  @ApiParam({ name: 'locale', required: true, type: String, example: 'fr' })
  @ApiPaginationQuery()
  @ApiResponse({
    status: 200,
    type: RetrieveItemDto,
  })
  async find(
    @Param('locale') locale: string,
    @Query() query: Partial<RetrieveItemFilter>,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PaginatedResponse<RetrieveItemDto>> {
    const validatedLocale = handleZodValidation(
      LocaleFilterValidation.safeParse(locale),
      { message: 'Invalid local parameters', logError: true },
    );

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
      validatedLocale,
      validatedFilter,
      pageOptionsInstance,
    );

    return { data, itemCount, totalCount, pageOptionsDto: pageOptionsInstance };
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.itemsService.findOne(+id);
  // }
}
