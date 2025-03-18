import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotImplementedException,
  ParseIntPipe,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiPaginationQuery } from 'src/common/decorators/pagination.decorator';
import { RetrieveItemDto } from './dto/retrieve-item.dto';
import { PaginatedResponse } from 'src/common/types/response.type';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    throw new NotImplementedException('This actions is not permitted');
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all items' })
  @ApiQuery({
    name: 'itemTypeId',
    required: true,
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
    @Query('itemTypeId', ParseIntPipe) itemTypeId: number,
    @Query('locale') locale: string,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('title') title?: string,
  ): Promise<PaginatedResponse<RetrieveItemDto>> {
    const dto = {
      itemTypeId,
      title,
      locale,
    };
    const { results, itemCount, totalCount } = await this.itemsService.find(
      dto,
      pageOptionsDto,
    );
    return { results, itemCount, totalCount, pageOptionsDto };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    throw new NotImplementedException('This actions is not permitted');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    throw new NotImplementedException('This actions is not permitted');
  }
}
