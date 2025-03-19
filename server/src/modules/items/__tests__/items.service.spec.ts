import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from '../items.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { RetrieveItemFilter } from '../filters/retrieve-item.filter';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { BadRequestException } from '@nestjs/common';
import { Item } from '../schemas/item.schema';
import { testItems } from './test-data';
import { closeTestDB, initTestDB } from 'src/common/__tests__/db.setup';

describe('ItemsService', () => {
  let service: ItemsService;
  let model: Model<any>;

  beforeAll(async () => {
    model = await initTestDB();
    await model.insertMany(testItems);
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getModelToken(Item.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return results when title is not provided but itemTypeId and locale are provided', async () => {
    const dto: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
    };
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    const { results, itemCount, totalCount } = await service.find(
      dto,
      pageOptionsDto,
    );

    expect(results).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(itemCount).toEqual(2);
    expect(totalCount).toEqual(2);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('level');
    expect(results[0].title).toBe('Gobball Amulet');
  });

  it('should return results when title is an empty string', async () => {
    const dto: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
      title: '',
    };
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    const { results, itemCount, totalCount } = await service.find(
      dto,
      pageOptionsDto,
    );

    expect(results).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(itemCount).toEqual(2);
    expect(totalCount).toEqual(2);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('title');
    expect(results[1].title).toBe('Tofu Amulet');
  });

  it('should return items when all the filters are provided', async () => {
    const dto: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
      title: 'amu',
    };
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };
    const { results, itemCount, totalCount } = await service.find(
      dto,
      pageOptionsDto,
    );

    expect(results).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(itemCount).toEqual(2);
    expect(totalCount).toEqual(2);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('title');
    expect(results[1].title).toBe('Tofu Amulet');
  });

  it('should return items even if title is UPPERCASE', async () => {
    const dto: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
      title: 'AMU',
    };

    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    const { results, itemCount, totalCount } = await service.find(
      dto,
      pageOptionsDto,
    );

    expect(results).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(itemCount).toEqual(2);
    expect(totalCount).toEqual(2);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('title');
    expect(results[1].title).toBe('Tofu Amulet');
  });

  it('should return an error when take is superior to the accepted limit of 100', async () => {
    const dto: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
    };
    const pageOptionsDto: PageOptionsDto = {
      take: 101,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    // We need to assert the promise directly, not the result, that's why we have to do it that way
    await expect(service.find(dto, pageOptionsDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return an error when the locale is not in the zod enum', async () => {
    const dto: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'it',
    };
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };
    await expect(service.find(dto, pageOptionsDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return error when the locale is not provided', async () => {
    const dto: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: '',
    };
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    await expect(service.find(dto, pageOptionsDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should should return an error if page = 0', async () => {
    const dto: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
    };
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 0,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };
    await expect(service.find(dto, pageOptionsDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return an error if page is negative', async () => {
    const dto: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
    };

    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: -1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    await expect(service.find(dto, pageOptionsDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return an error if title is a number', async () => {
    const dto: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
      title: 123 as any,
    };
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };
    await expect(service.find(dto, pageOptionsDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return the exact take number', async () => {
    const dto: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
    };
    const pageOptionsDto: PageOptionsDto = {
      take: 1,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    const { results, itemCount, totalCount } = await service.find(
      dto,
      pageOptionsDto,
    );

    expect(results).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(itemCount).toEqual(1);
    expect(totalCount).toEqual(2);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('title');
    expect(results[0].title).toBe('Gobball Amulet');
  });

  it('should return other item when pagination change', async () => {
    // First page
    const dto: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
    };
    const pageOptionsDto: PageOptionsDto = {
      take: 1,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    const { results, itemCount, totalCount } = await service.find(
      dto,
      pageOptionsDto,
    );

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Gobball Amulet');

    // Second page
    const pageOptionsDtoBis: PageOptionsDto = {
      take: 1,
      skip: 0,
      page: 2,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    const { results: resultsBis } = await service.find(dto, pageOptionsDtoBis);

    expect(resultsBis).toHaveLength(1);
    expect(resultsBis[0].title).toBe('Tofu Amulet');

    // Final Check
    expect(results[0].title).not.toBe(resultsBis[0].title);
    expect(itemCount).toBe(1);
    expect(totalCount).toBe(2);
  });

  it('should return an empty array if no items correspond to the filter', async () => {
    const dto: RetrieveItemFilter = {
      itemTypeId: 180,
      locale: 'en',
    };
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    const { results, itemCount, totalCount } = await service.find(
      dto,
      pageOptionsDto,
    );

    expect(results).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(itemCount).toEqual(0);
    expect(totalCount).toEqual(0);
  });

  it('should only return the property defined in the project', async () => {
    const dto: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
    };
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    const { results, itemCount, totalCount } = await service.find(
      dto,
      pageOptionsDto,
    );

    expect(results).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(itemCount).toEqual(2);
    expect(totalCount).toEqual(2);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('description');
    expect(results[0]).toHaveProperty('baseParameters.itemTypeId');
    expect(results[0]).toHaveProperty('baseParameters.itemSetId');
    expect(results[0].title).toBe('Gobball Amulet');
  });

  it('should return plain JavaScript objects (not mongoose Documents) since we use lean() and not exec()', async () => {
    const dto: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
    };
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    const { results, itemCount, totalCount } = await service.find(
      dto,
      pageOptionsDto,
    );

    expect(results).toBeInstanceOf(Array);
    expect(itemCount).toEqual(2);
    expect(totalCount).toEqual(2);

    // Check if each object isn't an intance of mongoose.Document
    results.forEach((item) => {
      expect(item).not.toHaveProperty('save'); // save is a method of mongoose.Document
      expect(item).not.toBeInstanceOf(model); // Check it's not a model mongoose
    });
  });

  it('should return items sorted in ascending order', async () => {
    const dto: RetrieveItemFilter = { itemTypeId: 120, locale: 'en' };
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    const { results } = await service.find(dto, pageOptionsDto);
    expect(results[0].id).toBeLessThan(results[1].id);
  });

  it('should return items sorted in descending order', async () => {
    const dto: RetrieveItemFilter = { itemTypeId: 120, locale: 'en' };
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'DESC',
      orderBy: 'definition.item.id',
    };

    const { results } = await service.find(dto, pageOptionsDto);
    expect(results[0].id).toBeGreaterThan(results[1].id);
  });

  it('should return maximum results <= take because itemTypeId is not provided', async () => {
    const dto: RetrieveItemFilter = { locale: 'en' };
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };
    const { results, itemCount, totalCount } = await service.find(
      dto,
      pageOptionsDto,
    );

    expect(results).toBeDefined()
    expect(itemCount).toBeDefined()
    expect(totalCount).toBeDefined()
    expect(itemCount).toEqual(4)
    expect(totalCount).toEqual(4)
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('title');
    expect(results[1].id).toEqual(2022);
    expect(results[1]).toHaveProperty('level');
  });
});
