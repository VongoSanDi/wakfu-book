import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from '../items.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { Item } from '../schemas/item.schema';
import { testItems } from './test-data';
import { closeTestDB, initTestDB } from '../../../common/__tests__/db.setup';
import { RetrieveItemFilter } from '../validations/items.validation';

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
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const { data, itemCount, totalCount } = await service.find(
      query,
      pageOptionsDto,
    );

    expect(data).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(itemCount).toEqual(2);
    expect(totalCount).toEqual(2);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('title');
    expect(data[0]).toHaveProperty('level');
    expect(data[0].baseParameters).toHaveProperty('itemTypeId');
    expect(data[0].title).toBe('Gobball Amulet');
  });

  it('should return results when title is an empty string', async () => {
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
      title: '',
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const { data, itemCount, totalCount } = await service.find(
      query,
      pageOptionsDto,
    );

    expect(data).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(itemCount).toEqual(2);
    expect(totalCount).toEqual(2);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('title');
    expect(data[1].title).toBe('Tofu Amulet');
  });

  it('should return items when all the filters are provided', async () => {
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
      title: 'amu',
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });
    const { data, itemCount, totalCount } = await service.find(
      query,
      pageOptionsDto,
    );

    expect(data).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(itemCount).toEqual(2);
    expect(totalCount).toEqual(2);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('title');
    expect(data[1].title).toBe('Tofu Amulet');
  });

  it('should return items even if title is UPPERCASE', async () => {
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
      title: 'AMU',
    };

    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const { data, itemCount, totalCount } = await service.find(
      query,
      pageOptionsDto,
    );

    expect(data).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(itemCount).toEqual(2);
    expect(totalCount).toEqual(2);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('title');
    expect(data[1].title).toBe('Tofu Amulet');
  });

  it('should return the exact take number', async () => {
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 1,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const { data, itemCount, totalCount } = await service.find(
      query,
      pageOptionsDto,
    );

    expect(data).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(itemCount).toEqual(1);
    expect(totalCount).toEqual(2);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('title');
    expect(data[0].title).toBe('Gobball Amulet');
  });

  it('should return other item when pagination change', async () => {
    // First page
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 1,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const { data, itemCount, totalCount } = await service.find(
      query,
      pageOptionsDto,
    );

    expect(data).toHaveLength(1);
    expect(data[0].title).toBe('Gobball Amulet');

    // Second page
    const pageOptionsDtoBis = new PageOptionsDto({
      take: 1,
      page: 2,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const { data: dataBis } = await service.find(query, pageOptionsDtoBis);

    expect(dataBis).toHaveLength(1);
    expect(dataBis[0].title).toBe('Tofu Amulet');

    // Final Check
    expect(data[0].title).not.toBe(dataBis[0].title);
    expect(itemCount).toBe(1);
    expect(totalCount).toBe(2);
  });

  it('should return an empty array if no items correspond to the filter', async () => {
    const query: RetrieveItemFilter = {
      itemTypeId: 180,
      locale: 'en',
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const { data, itemCount, totalCount } = await service.find(
      query,
      pageOptionsDto,
    );

    expect(data).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(itemCount).toEqual(0);
    expect(totalCount).toEqual(0);
  });

  it('should only return the property defined in the project', async () => {
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const { data, itemCount, totalCount } = await service.find(
      query,
      pageOptionsDto,
    );

    expect(data).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(itemCount).toEqual(2);
    expect(totalCount).toEqual(2);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('title');
    expect(data[0]).toHaveProperty('description');
    expect(data[0]).toHaveProperty('baseParameters.itemTypeId');
    expect(data[0]).toHaveProperty('baseParameters.itemSetId');
    expect(data[0].title).toBe('Gobball Amulet');
  });

  it('should return plain JavaScript objects (not mongoose Documents) since we use lean() and not exec()', async () => {
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
      locale: 'en',
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const { data, itemCount, totalCount } = await service.find(
      query,
      pageOptionsDto,
    );

    expect(data).toBeInstanceOf(Array);
    expect(itemCount).toEqual(2);
    expect(totalCount).toEqual(2);

    // Check if each object isn't an intance of mongoose.Document
    data.forEach((item) => {
      expect(item).not.toHaveProperty('save'); // save is a method of mongoose.Document
      expect(item).not.toBeInstanceOf(model); // Check it's not a model mongoose
    });
  });

  it('should return items sorted in ascending order', async () => {
    const query: RetrieveItemFilter = { itemTypeId: 120, locale: 'en' };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const { data } = await service.find(query, pageOptionsDto);
    expect(data[0].id).toBeLessThan(data[1].id);
  });

  it('should return items sorted in descending order', async () => {
    const query: RetrieveItemFilter = { itemTypeId: 120, locale: 'en' };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'DESC',
      orderBy: 'definition.item.id',
    });

    const { data } = await service.find(query, pageOptionsDto);
    expect(data[0].id).toBeGreaterThan(data[1].id);
  });

  it('should return maximum results <= take because itemTypeId is not provided', async () => {
    const query: RetrieveItemFilter = { locale: 'en' };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });
    const { data, itemCount, totalCount } = await service.find(
      query,
      pageOptionsDto,
    );

    expect(data).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(totalCount).toBeDefined();
    expect(itemCount).toEqual(4);
    expect(totalCount).toEqual(4);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('title');
    expect(data[1].id).toEqual(2022);
    expect(data[1]).toHaveProperty('level');
  });

  it('should return all items when take equals totalCount', async () => {
    const query: RetrieveItemFilter = { locale: 'en' };
    const pageOptionsDto = new PageOptionsDto({
      take: 4,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const { data, itemCount, totalCount } = await service.find(query, pageOptionsDto);

    expect(data).toHaveLength(4);
    expect(itemCount).toEqual(4);
    expect(totalCount).toEqual(4);
  });

  it('should return an empty list when skip exceeds totalCount', async () => {
    const dto: RetrieveItemFilter = { locale: 'en' };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 11, // Does not exist
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const { data, itemCount, totalCount } = await service.find(dto, pageOptionsDto);

    expect(data).toHaveLength(0);
    expect(itemCount).toEqual(0);
    expect(totalCount).toBeGreaterThan(0);
  });

  it('should return results when title contains special characters', async () => {
    const query: RetrieveItemFilter = {
      locale: 'en',
      title: '$amu%',
    };
    const pageOptionsDto = new PageOptionsDto({ take: 10, page: 1 });

    const { data, itemCount, totalCount } = await service.find(query, pageOptionsDto);

    expect(data).toBeDefined();
    expect(itemCount).toBeGreaterThanOrEqual(0);
    expect(totalCount).toBeGreaterThanOrEqual(0);
  });
});
