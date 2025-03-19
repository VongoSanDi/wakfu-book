import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiPaginationQuery } from '../../common/decorators/pagination.decorator';
import { RetrieveItemDto } from './dto/retrieve-item.dto';
import { PaginatedResponse } from '../../common/types/response.type';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

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
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('locale') locale: string,
    @Query('itemTypeId', ParseIntPipe) itemTypeId?: number,
    @Query('title') title?: string,
  ): Promise<PaginatedResponse<RetrieveItemDto>> {
    const dto = {
      itemTypeId,
      title,
      locale,
    };
    const { data, itemCount, totalCount } = await this.itemsService.find(
      dto,
      pageOptionsDto,
    );
    return { data, itemCount, totalCount, pageOptionsDto };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }
}
