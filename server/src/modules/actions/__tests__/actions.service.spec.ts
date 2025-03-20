import { Test, TestingModule } from '@nestjs/testing';
import { ActionsService } from '../actions.service';
import { Model } from 'mongoose';
import { closeTestDB, initTestDB } from '../../../common/__tests__/db.setup';
import { mockActionsData } from './mock-actions-data';
import { getModelToken } from '@nestjs/mongoose';
import { Action, ActionSchema } from '../schemas/actions.schema';
import { RetrieveActionFilter } from '../validations/actions.validation';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';

describe('ActionsService', () => {
  let service: ActionsService;
  let model: Model<Action>;

  beforeAll(async () => {
    const db = await initTestDB();
    if (!db) {
      throw new Error('Database connection failed.');
    }

    model = db.model(Action.name, ActionSchema);
    await model.insertMany(mockActionsData);
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionsService,
        {
          provide: getModelToken(Action.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<ActionsService>(ActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should return itemsCount = 0, totalCount = 0 and data = [] if filter don't existe in db", async () => {
    const locale = 'en';
    const query: RetrieveActionFilter = {
      id: 0,
    };
    const pageoptionsdto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'asc',
      orderBy: 'id',
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
    const query: RetrieveActionFilter = {
      id: 1,
    };
    const pageoptionsdto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'asc',
      orderBy: 'id',
    });

    const { data } = await service.find(locale, query, pageoptionsdto);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('effect');
    expect(data[0]).toHaveProperty('description');
  });

  it('should return other item when pagination change', async () => {
    // First page
    const locale = 'en';
    const query: RetrieveActionFilter = {};
    const pageOptionsDto = new PageOptionsDto({
      take: 1,
      page: 1,
      order: 'ASC',
      orderBy: 'id',
    });

    const { data, itemCount, totalCount } = await service.find(
      locale,
      query,
      pageOptionsDto,
    );

    expect(data).toHaveLength(1);
    expect(data[0].id).toBe(1);

    // Second page
    const pageOptionsDtoBis = new PageOptionsDto({
      take: 1,
      page: 2,
      order: 'ASC',
      orderBy: 'id',
    });

    const { data: dataBis } = await service.find(
      locale,
      query,
      pageOptionsDtoBis,
    );

    expect(dataBis).toHaveLength(1);
    expect(dataBis[0].id).toBe(20);

    // Final Check
    expect(data[0].id).not.toBe(dataBis[0].id);
    expect(itemCount).toBe(1);
    expect(totalCount).toBe(5);
  });

  it('should return plain JavaScript objects (not mongoose Documents) since we use lean() and not exec()', async () => {
    const locale = 'en';
    const query: RetrieveActionFilter = {
      id: 1,
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'id',
    });

    const { data, itemCount, totalCount } = await service.find(
      locale,
      query,
      pageOptionsDto,
    );

    expect(data).toBeInstanceOf(Array);
    expect(itemCount).toEqual(1);
    expect(totalCount).toEqual(1);

    // Check if each object isn't an intance of mongoose.Document
    data.forEach((item) => {
      expect(item).not.toHaveProperty('save'); // save is a method of mongoose.Document
      expect(item).not.toBeInstanceOf(model); // Check it's not a model mongoose
    });
  });

  it('should return items sorted in ascending order', async () => {
    const locale = 'en';
    const query: RetrieveActionFilter = {};
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'id',
    });

    const { data } = await service.find(locale, query, pageOptionsDto);
    expect(data[0].id).toBeLessThan(data[1].id);
  });

  it('should return items sorted in descending order', async () => {
    const locale = 'en';
    const query: RetrieveActionFilter = {};
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'DESC',
      orderBy: 'definition.id',
    });

    const { data } = await service.find(locale, query, pageOptionsDto);

    expect(data[0].id).toBeGreaterThan(data[1].id);
  });

  it('should return all items when take equals totalCount', async () => {
    const locale = 'en';
    const pageOptionsDto = new PageOptionsDto({
      take: 5,
      page: 1,
      order: 'ASC',
      orderBy: 'id',
    });

    const { data, itemCount, totalCount } = await service.find(
      locale,
      {},
      pageOptionsDto,
    );

    expect(data).toHaveLength(5);
    expect(itemCount).toEqual(5);
    expect(totalCount).toEqual(5);
  });

  it('should return all items when take > totalCount', async () => {
    const locale = 'en';
    const pageOptionsDto = new PageOptionsDto({
      take: 6,
      page: 1,
      order: 'ASC',
      orderBy: 'id',
    });

    const { data, itemCount, totalCount } = await service.find(
      locale,
      {},
      pageOptionsDto,
    );

    expect(data).toHaveLength(5);
    expect(itemCount).toEqual(5);
    expect(totalCount).toEqual(5);
  });

  it('should return an empty list when skip exceeds totalCount', async () => {
    const locale = 'en';
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 11, // Does not exist
      order: 'ASC',
      orderBy: 'id',
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
