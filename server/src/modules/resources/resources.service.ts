import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Resource, ResourceDocument } from './schemas/resource.schema';
import { Model, SortOrder } from 'mongoose';
import { RetrieveResourceFilter } from './validations/resources.validation';
import { LocaleFilter } from '../../common/validations/locale-validation';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { RetrieveResourceDto } from './dto/retrieve-resource.dto';
import { ResourceMapper } from './mappings/resource-mapper';

@Injectable()
export class ResourcesService {
  constructor(@InjectModel(Resource.name) private readonly resourceModel: Model<ResourceDocument>) { }

  /**
   * Retrieves a paginated list of resource based on the provided filters and pagination options.
   *
   * @param {LocaleFilter} locale - The locale in which we want the title.
   * @param {RetrieveResourceFilter} query - The filters to apply when retrieving resources.
   * @param {PageOptionsDto} pageOptionsDto - Pagination and sorting options.
   * @returns {Promise<{ data: RetrieveResourceDto[]; itemCount: number; totalCount: number }>}
   * An object containing:
   * - `data`: The retrieved actions mapped to DTOs.
   * - `itemCount`: The number of actions in the current page.
   * - `totalCount`: The total number of matching actions in the database.
   */
  async find(
    locale: LocaleFilter,
    query: RetrieveResourceFilter,
    pageOptionsDto: PageOptionsDto
  ): Promise<{
    data: RetrieveResourceDto[];
    itemCount: number;
    totalCount: number;
  }> {
    const { resourceType } = query;
    const { take, skip, order, orderBy } = pageOptionsDto;
    const sortOrder: SortOrder = order.toUpperCase() === 'DESC' ? -1 : 1;
    const sortQuery = orderBy ? { [orderBy]: sortOrder } : {};
    const filter: Record<string, any> = {};
    if (resourceType !== undefined) {
      filter['definition.resourceType'] = resourceType;
    }

    const projection = {
      _id: 0,
      'definition.id': 1,
      'definition.resourceType': 1,
      'definition.isBlocking': 1,
      'definition.idealRainRangeMin': 1,
      'definition.idealRainRangeMax': 1,
      'definition.idealTemperatureRangeMin': 1,
      'definition.idealTemperatureRangeMax': 1,
      'definition.iconGfxId': 1,
      'definition.lastEvolutionStep': 1,
      'definition.usableByHeroes': 1,
      'definition.idealRain': 1,
      [`title.${locale}`]: 1,
    };

    const totalCountPromise = this.resourceModel.countDocuments(filter);
    const resultsPromise = this.resourceModel
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
      ResourceMapper.toDto(item, locale),
    );
    return {
      data: resultsMapped,
      itemCount: resultsMapped.length,
      totalCount: totalCount,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} resource`;
  }
}
