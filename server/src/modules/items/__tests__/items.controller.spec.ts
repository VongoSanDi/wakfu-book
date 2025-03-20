import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from '../items.controller';
import { ItemsService } from '../items.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { closeTestDB, initTestDB } from '../../../common/__tests__/db.setup';
import { mockItemsData } from './mock-items-data';
import { Item, ItemSchema } from '../schemas/item.schema';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { TransformInterceptor } from '../../../common/interceptors/transform.interceptor';
import { lastValueFrom, of } from 'rxjs';
import { RetrieveItemFilter } from '../validations/items.validation';
import { BadRequestException } from '@nestjs/common';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;
  let model: Model<Item>;

  beforeAll(async () => {
    const db = await initTestDB();
    if (!db) {
      throw new Error('Database connection failed.');
    }

    model = db.model(Item.name, ItemSchema);
    await model.insertMany(mockItemsData);
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        ItemsService,
        {
          provide: getModelToken(Item.name),
          useValue: model,
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a paginated list of 1 item', async () => {
    const locale = 'en';
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 1,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const { data, itemCount, totalCount } = await controller.find(
      locale,
      query,
      pageOptionsDto,
    );

    expect(data).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(totalCount).toBeDefined();
    expect(itemCount).toEqual(1);
    expect(totalCount).toEqual(2);
    expect(data[0]).toHaveProperty('title');
  });

  it('should return items when query is not provided', async () => {
    const locale = 'en';
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const { data, itemCount, totalCount } = await controller.find(
      locale,
      {},
      pageOptionsDto,
    );

    expect(data).toBeDefined();
    expect(itemCount).toBeGreaterThan(0);
    expect(totalCount).toBeGreaterThan(0);
  });

  it('should raise exception when locale and query is missing', async () => {
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    await expect(controller.find('', {}, pageOptionsDto)).rejects.toThrow();
  });

  it('should return a transformed paginated result via the interceptor', async () => {
    const locale = 'en';
    const query: RetrieveItemFilter = { itemTypeId: 120 };
    const pageOptionsDto = new PageOptionsDto({
      take: 1,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    const rawResponse = await controller.find(locale, query, pageOptionsDto);

    const interceptor = new TransformInterceptor<
      (typeof rawResponse.data)[number] // Récupère le type d’un élément du tableau
    >();

    const executionContextMock = {
      switchToHttp: () => ({ getResponse: () => ({}) }),
    } as any;
    const transformedResponse = await lastValueFrom(
      interceptor.intercept(executionContextMock, {
        handle: () => of(rawResponse),
      } as any),
    );

    expect(transformedResponse.data).toBeInstanceOf(Array);
    expect(transformedResponse.meta).toBeInstanceOf(Object);
    expect(typeof transformedResponse.timestamp).toBe('string');
    expect(transformedResponse.data![0]).toHaveProperty('id');
    expect(transformedResponse.data![0].baseParameters).toHaveProperty(
      'itemTypeId',
    );
    expect(transformedResponse.meta!.page).toEqual(1);
    expect(transformedResponse.meta!.itemCount).toEqual(1);
    expect(transformedResponse.meta!.totalCount).toEqual(2);
    expect(transformedResponse.meta!.hasPreviousPage).toBe(false);
    expect(transformedResponse.meta!.hasNextPage).toBe(true);
  });

  it('should return error when the locale is not provided but query is', async () => {
    const locale = '' as any;
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    await expect(
      controller.find(locale, query, pageOptionsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return an error if page is negative', async () => {
    const locale = 'en';
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
    };

    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: -1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    await expect(
      controller.find(locale, query, pageOptionsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return an error if title is a number', async () => {
    const locale = 'en';
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
      title: 123 as any,
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });
    await expect(
      controller.find(locale, query, pageOptionsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return an error when the locale is not in the zod enum', async () => {
    const locale = 'it' as any;
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });
    await expect(
      controller.find(locale, query, pageOptionsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should should return an error if page = 0', async () => {
    const locale = 'en';
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 0,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    await expect(
      controller.find(locale, query, pageOptionsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return an error when take is superior to the accepted limit of 100', async () => {
    const locale = 'en';
    const query: RetrieveItemFilter = {
      itemTypeId: 120,
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 101,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    // We need to assert the promise directly, not the result, that's why we have to do it that way
    await expect(
      controller.find(locale, query, pageOptionsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return an error if take is negative', async () => {
    const locale = 'en';
    const pageOptionsDto = new PageOptionsDto({
      take: -5,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    });

    await expect(controller.find(locale, {}, pageOptionsDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return an error if locale is an empty string', async () => {
    const locale = '' as any;
    const pageOptionsDto = new PageOptionsDto({ take: 10, page: 1 });

    await expect(controller.find(locale, {}, pageOptionsDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return an error if orderBy is invalid', async () => {
    const locale = 'en';
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'invalidColumn',
    });

    await expect(controller.find(locale, {}, pageOptionsDto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
