import { Injectable } from '@nestjs/common';
import { Item, ItemDocument } from './schemas/item.schema';
import { Model, SortOrder } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RetrieveItemDto } from './dto/retrieve-item.dto';
import { ItemMapper } from './mappings/item-mapper';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { RetrieveItemFilter } from './validations/items.validation';
import { LocaleFilter } from '../../common/validations/locale-validation';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
  ) { }

  /**
   * Retrieves a paginated list of items based on the provided filters and pagination options.
   *
   * @param {LocaleFilter} locale - The locale in which we want the title/description
   * @param {RetrieveItemFilter} query - The filters to apply when retrieving items.
   * @param {PageOptionsDto} pageOptionsDto - Pagination and sorting options.
   * @returns {Promise<{ data: RetrieveItemDto[]; itemCount: number; totalCount: number }>}
   * An object containing:
   * - `data`: The retrieved items mapped to DTOs.
   * - `itemCount`: The number of items in the current page.
   * - `totalCount`: The total number of matching items in the database.
   */
  async find(
    locale: LocaleFilter,
    query: RetrieveItemFilter,
    pageOptionsDto: PageOptionsDto,
  ): Promise<{
    data: RetrieveItemDto[];
    itemCount: number;
    totalCount: number;
  }> {
    const { itemTypeId, title, levelMin, levelMax } = query;
    const { take, skip, order, orderBy } = pageOptionsDto;

    // In MongoDB, order format is ASC = 1, DESC = -1
    const sortOrder: SortOrder = order.toUpperCase() === 'DESC' ? -1 : 1;
    const sortQuery = orderBy ? { [orderBy]: sortOrder } : {};
    const filter: Record<string, any> = {};
    if (itemTypeId !== undefined) {
      filter['definition.item.baseParameters.itemTypeId'] = itemTypeId;
    }
    if (title !== undefined) {
      filter[`title.${locale}`] = { $regex: title, $options: 'i' }; // Recherche insensible à la casse
    }
    if (levelMin !== undefined || levelMax !== undefined) {
      filter['definition.item.level'] = {
        ...(levelMin !== undefined && { $gte: levelMin }),
        ...(levelMax !== undefined && { $lte: levelMax }),
      };
    }

    const projection = {
      _id: 0,
      'definition.item.id': 1,
      'definition.item.level': 1,
      'definition.item.baseParameters.itemTypeId': 1,
      'definition.item.baseParameters.itemSetId': 1,
      'definition.item.graphicParameters.gfxId': 1,
      'definition.item.graphicParameters.femaleGfxId': 1,
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
