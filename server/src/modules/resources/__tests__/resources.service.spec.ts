import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesService } from '../resources.service';
import { Model } from 'mongoose';
import { Resource, ResourceSchema } from '../schemas/resource.schema';
import { closeTestDB, initTestDB } from '../../../common/__tests__/db.setup';
import { mockResourcesData } from './mock-resources-data';
import { getModelToken } from '@nestjs/mongoose';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { RetrieveResourceFilter } from '../validations/resources.validation';

describe('ResourcesService', () => {
  let service: ResourcesService;
  let model: Model<Resource>;

  beforeAll(async () => {
    const db = await initTestDB();
    if (!db) {
      throw new Error('Database connection failed.');
    }

    model = db.model(Resource.name, ResourceSchema);
    await model.insertMany(mockResourcesData);
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourcesService,
        {
          provide: getModelToken(Resource.name),
          useValue: model,
        },

      ],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should return itemsCount = 0, totalCount = 0 and data = [] if filter don't existe in db", async () => {
    const locale = 'en';
    const query: RetrieveResourceFilter = {
      resourceType: 0,
    };
    const pageoptionsdto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'asc',
      orderBy: 'definition.id',
    });

    const { data, itemCount, totalCount } = await service.find(
      locale,
      query,
      pageoptionsdto,
    );

    expect(data).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(totalCount).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(itemCount).toEqual(0);
    expect(totalCount).toEqual(0);
  });

  it('should send all properties', async () => {
    const locale = 'en';
    const query: RetrieveResourceFilter = {
      resourceType: 1,
    };
    const pageoptionsdto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'asc',
      orderBy: 'definition.id',
    });

    const { data } = await service.find(locale, query, pageoptionsdto);

    expect(data[0].definition).toHaveProperty('id');
    expect(data[0].definition).toHaveProperty('resourceType');
    expect(data[0].definition).toHaveProperty('isBlocking');
    expect(data[0].definition).toHaveProperty('idealRainRangeMin');
    expect(data[0].definition).toHaveProperty('idealRainRangeMax');
    expect(data[0].definition).toHaveProperty('idealTemperatureRangeMin');
    expect(data[0].definition).toHaveProperty('idealTemperatureRangeMax');
    expect(data[0].definition).toHaveProperty('iconGfxId');
    expect(data[0].definition).toHaveProperty('lastEvolutionStep');
    expect(data[0].definition).toHaveProperty('usableByHeroes');
    expect(data[0].definition).toHaveProperty('idealRain');
    expect(data[0]).toHaveProperty('title');
  });

  it('should return other item when pagination change', async () => {
    // First page
    const locale = 'en';
    const query: RetrieveResourceFilter = {};
    const pageOptionsDto = new PageOptionsDto({
      take: 1,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.id',
    });

    const { data, itemCount, totalCount } = await service.find(
      locale,
      query,
      pageOptionsDto,
    );

    expect(data).toHaveLength(1);
    expect(data[0].definition.id).toBe(6);

    // Second page
    const pageOptionsDtoBis = new PageOptionsDto({
      take: 1,
      page: 2,
      order: 'ASC',
      orderBy: 'definition.id',
    });

    const { data: dataBis } = await service.find(
      locale,
      query,
      pageOptionsDtoBis,
    );

    expect(dataBis).toHaveLength(1);
    expect(dataBis[0].definition.id).toBe(8);

    // Final Check
    expect(data[0].definition.id).not.toBe(dataBis[0].definition.id);
    expect(itemCount).toBe(1);
    expect(totalCount).toBe(8);
  });

  it('should return plain JavaScript objects (not mongoose Documents) since we use lean() and not exec()', async () => {
    const locale = 'en';
    const query: RetrieveResourceFilter = {
      resourceType: 1,
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.id',
    });

    const { data, itemCount, totalCount } = await service.find(
      locale,
      query,
      pageOptionsDto,
    );

    expect(data).toBeInstanceOf(Array);
    expect(itemCount).toEqual(3);
    expect(totalCount).toEqual(3);

    // Check if each object isn't an intance of mongoose.Document
    data.forEach((item) => {
      expect(item).not.toHaveProperty('save'); // save is a method of mongoose.Document
      expect(item).not.toBeInstanceOf(model); // Check it's not a model mongoose
    });
  });

  it('should return items sorted in ascending order', async () => {
    const locale = 'en';
    const query: RetrieveResourceFilter = {};
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.id',
    });

    const { data } = await service.find(locale, query, pageOptionsDto);
    expect(data[0].definition.id).toBeLessThan(data[1].definition.id);
  });

  it('should return items sorted in descending order', async () => {
    const locale = 'en';
    const query: RetrieveResourceFilter = {};
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'DESC',
      orderBy: 'definition.id',
    });

    const { data } = await service.find(locale, query, pageOptionsDto);

    expect(data[0].definition.id).toBeGreaterThan(data[1].definition.id);
  });

  it('should return all items when take equals totalCount', async () => {
    const locale = 'en';
    const pageOptionsDto = new PageOptionsDto({
      take: 8,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.id',
    });

    const { data, itemCount, totalCount } = await service.find(
      locale,
      {},
      pageOptionsDto,
    );

    expect(data).toHaveLength(8);
    expect(itemCount).toEqual(8);
    expect(totalCount).toEqual(8);
  });

  it('should return all items when take > totalCount', async () => {
    const locale = 'en';
    const pageOptionsDto = new PageOptionsDto({
      take: 9,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.id',
    });

    const { data, itemCount, totalCount } = await service.find(
      locale,
      {},
      pageOptionsDto,
    );

    expect(data).toHaveLength(8);
    expect(itemCount).toEqual(8);
    expect(totalCount).toEqual(8);
  });

  it('should return an empty list when skip exceeds totalCount', async () => {
    const locale = 'en';
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 11, // Does not exist
      order: 'ASC',
      orderBy: 'definition.id',
    });

    const { data, itemCount, totalCount } = await service.find(
      locale,
      {},
      pageOptionsDto,
    );

    expect(data).toHaveLength(0);
    expect(itemCount).toEqual(0);
    expect(totalCount).toBeGreaterThan(0);
  });
});
