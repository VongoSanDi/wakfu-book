import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Action, ActionDocument } from './schemas/actions.schema';
import { Model, SortOrder } from 'mongoose';
import { RetrieveActionDto } from './dto/retrieve-action.dto';
import { RetrieveActionFilter } from './validations/actions.validation';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { LocaleFilter } from '../../common/validations/locale-validation';
import { ActionMapper } from './mappings/action-mapper';

@Injectable()
export class ActionsService {
  constructor(
    @InjectModel(Action.name)
    private readonly actionModel: Model<ActionDocument>,
  ) { }

  /**
   * Retrieves a paginated list of actions based on the provided filters and pagination options.
   *
   * @param {LocaleFilter} locale - The locale in which we want the title/description
   * @param {RetrieveActionFilter} query - The filters to apply when retrieving actions.
   * @param {PageOptionsDto} pageOptionsDto - Pagination and sorting options.
   * @returns {Promise<{ data: RetrieveActionDto[]; itemCount: number; totalCount: number }>}
   * An object containing:
   * - `data`: The retrieved actions mapped to DTOs.
   * - `itemCount`: The number of actions in the current page.
   * - `totalCount`: The total number of matching actions in the database.
   */

  async find(
    locale: LocaleFilter,
    query: RetrieveActionFilter,
    pageOptionsDto: PageOptionsDto,
  ): Promise<{
    data: RetrieveActionDto[];
    itemCount: number;
    totalCount: number;
  }> {
    const { id, ids } = query;
    const { take, skip, order, orderBy } = pageOptionsDto;
    // In MongoDB, order format is ASC = 1, DESC = -1
    const sortOrder: SortOrder = order.toUpperCase() === 'DESC' ? -1 : 1;
    const sortQuery = orderBy ? { [orderBy]: sortOrder } : {};

    // On ne filtre que par ids ou id, pas les 2 en même temps
    const filter: Record<string, any> = {};
    if (ids !== undefined && ids.length > 0) {
      filter['definition.id'] = { $in: ids };
    } else if (id !== undefined) {
      filter['definition.id'] = id;
    }

    const projection = {
      _id: 0,
      'definition.id': 1,
      'definition.effect': 1,
      [`description.${locale}`]: 1,
    };

    const totalCountPromise = this.actionModel.countDocuments(filter);

    const resultsPromise = this.actionModel
      .find(filter, projection)
      .skip(skip)
      .limit(take)
      .sort(sortQuery)
      .lean();
    const [totalCount, results] = await Promise.all([
      totalCountPromise,
      resultsPromise,
    ]);
    const resultsMapped = results.map((item) =>
      ActionMapper.toDto(item, locale),
    );
    return {
      data: resultsMapped,
      itemCount: resultsMapped.length,
      totalCount: totalCount,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} action`;
  }
}
