import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from '../items.controller';
import { ItemsService } from '../items.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { closeTestDB, initTestDB } from '../../../common/__tests__/db.setup';
import { testItems } from './test-data';
import { Item } from '../schemas/item.schema';
import { RetrieveItemFilter } from '../filters/retrieve-item.filter';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { TransformInterceptor } from '../../../common/interceptors/transform.interceptor';
import { lastValueFrom, of } from 'rxjs';

describe('ItemsController', () => {
  let controller: ItemsController;
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

    const { data, itemCount, totalCount } = await controller.find(
      pageOptionsDto,
      dto.locale,
      dto.itemTypeId,
      dto.title,
    );

    expect(data).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(totalCount).toBeDefined();
    expect(itemCount).toEqual(1);
    expect(totalCount).toEqual(2);
    expect(data[0]).toHaveProperty('title');
  });

  it('should return items when itemTypeId is not provided', async () => {
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    const { data, itemCount, totalCount } = await controller.find(
      pageOptionsDto,
      'en',
    );

    expect(data).toBeDefined();
    expect(itemCount).toBeGreaterThan(0);
    expect(totalCount).toBeGreaterThan(0);
  });

  it('should exception when locale is missing', async () => {
    const pageOptionsDto: PageOptionsDto = {
      take: 10,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    await expect(
      controller.find(pageOptionsDto, undefined as any, 120),
    ).rejects.toThrow();
  });

  it('should return a transformed paginated result via the interceptor', async () => {
    const dto: RetrieveItemFilter = { itemTypeId: 120, locale: 'en' };
    const pageOptionsDto: PageOptionsDto = {
      take: 1,
      skip: 0,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.item.id',
    };

    const rawResponse = await controller.find(
      pageOptionsDto,
      dto.locale,
      dto.itemTypeId,
    );

    const interceptor = new TransformInterceptor<
      typeof rawResponse.data[number] // Récupère le type d’un élément du tableau
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
    expect(typeof transformedResponse.timestamp).toBe('string')
    expect(transformedResponse.data![0]).toHaveProperty('id')
    expect(transformedResponse.data![0].baseParameters).toHaveProperty('itemTypeId')
    expect(transformedResponse.meta!.page).toEqual(1)
    expect(transformedResponse.meta!.itemCount).toEqual(1)
    expect(transformedResponse.meta!.totalCount).toEqual(2)
    expect(transformedResponse.meta!.hasPreviousPage).toBe(false)
    expect(transformedResponse.meta!.hasNextPage).toBe(true)
  });
});
