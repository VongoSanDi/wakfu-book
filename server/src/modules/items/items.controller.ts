import { Controller, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiPaginationQuery } from '../../common/decorators/pagination.decorator';
import { RetrieveItemDto } from './dto/retrieve-item.dto';
import { PaginatedResponse } from '../../common/types/response.type';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { RetrieveItemFilter, RetrieveItemsFilterValidation } from './validations/items.validation';
import { PageOptionsDtoValidation } from '../../common/validations/page-options.validation';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

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
    const filterResult = RetrieveItemsFilterValidation.safeParse(query);
    if (!filterResult.success) {
      throw new BadRequestException({
        message: 'Invalid query parameters',
        errors: filterResult.error.format(),
      });
    }
    const pageOptionsResult = PageOptionsDtoValidation.safeParse(pageOptionsDto);
    if (!pageOptionsResult.success) {
      throw new BadRequestException({
        message: 'Invalid pagination parameters',
        errors: pageOptionsResult.error.format(),
      });
    }
    const pageOptionsInstance = new PageOptionsDto(pageOptionsResult.data);
    const { data, itemCount, totalCount } = await this.itemsService.find(
      filterResult.data,
      pageOptionsInstance
    );
    return { data, itemCount, totalCount, pageOptionsDto: pageOptionsInstance };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }
}
