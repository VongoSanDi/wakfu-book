import { Injectable } from '@nestjs/common';
import { Item, ItemDocument } from './schemas/item.schema';
import { Model, SortOrder } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RetrieveItemDto } from './dto/retrieve-item.dto';
import { ItemMapper } from './mappings/item-mapper';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { RetrieveItemFilter } from './validations/items.validation';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
  ) { }

  async find(
    dto: RetrieveItemFilter,
    pageOptionsDto: PageOptionsDto,
  ): Promise<{
    data: RetrieveItemDto[];
    itemCount: number;
    totalCount: number;
  }> {
    const { itemTypeId, locale, title } = dto;
    const { take, skip, order, orderBy } = pageOptionsDto;

    // In MongoDB, order format is ASC = 1, DESC = -1
    const sortOrder: SortOrder = order.toUpperCase() === 'DESC' ? -1 : 1;
    const sortQuery = orderBy ? { [orderBy]: sortOrder } : {};
    let filter = {};
    if (itemTypeId) {
      filter['definition.item.baseParameters.itemTypeId'] = itemTypeId;
    }
    if (title) {
      filter[`title.${locale}`] = { $regex: title, $options: 'i' }; // Recherche insensible à la casse
    }

    const projection = {
      _id: 0,
      'definition.item.id': 1,
      'definition.item.level': 1,
      'definition.item.baseParameters.itemTypeId': 1,
      'definition.item.baseParameters.itemSetId': 1,
      [`title.${locale}`]: 1,
      [`description.${locale}`]: 1,
    };

    const totalCountPromise = this.itemModel.countDocuments(filter);
    const resultsPromise = this.itemModel
      .find(filter, projection)
      .skip(skip)
      .limit(take)
      .sort(sortQuery)
      .lean();
    const [totalCount, results] = await Promise.all([
      totalCountPromise,
      resultsPromise,
    ]);
    const resultsMapped = results.map((item) => ItemMapper.toDto(item, locale));
    return {
      data: resultsMapped,
      itemCount: resultsMapped.length,
      totalCount: totalCount,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }
}
