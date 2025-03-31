import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesController } from '../resources.controller';
import { ResourcesService } from '../resources.service';
import { Resource, ResourceSchema } from '../schemas/resource.schema';
import { mockResourcesData } from './mock-resources-data';
import { closeTestDB, initTestDB } from '../../../common/__tests__/db.setup';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { RetrieveResourceFilter } from '../validations/resources.validation';
import { TransformInterceptor } from '../../../common/interceptors/transform.interceptor';
import { lastValueFrom, of } from 'rxjs';
import { BadRequestException } from '@nestjs/common';

describe('ResourcesController', () => {
  let controller: ResourcesController;
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
      controllers: [ResourcesController],
      providers: [
        ResourcesService,
        {
          provide: getModelToken(Resource.name),
          useValue: model,
        },

      ],
    }).compile();

    controller = module.get<ResourcesController>(ResourcesController);
    service = module.get<ResourcesService>(ResourcesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a paginated list of 1 item', async () => {
    const locale = 'en';
    const pageOptionsDto = new PageOptionsDto({
      take: 1,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.id',
    });

    const { data, itemCount, totalCount } = await controller.find(
      locale,
      {},
      pageOptionsDto,
    );

    expect(data).toBeDefined();
    expect(itemCount).toBeDefined();
    expect(totalCount).toBeDefined();
    expect(itemCount).toEqual(1);
    expect(totalCount).toEqual(8);
    expect(data[0]).toHaveProperty('title');
    expect(data[0].title).toBe('Api Tree');
    expect(data[0]).toHaveProperty('definition');
    expect(data[0].definition).toHaveProperty('id');
  });

  it('should return items when query is not provided', async () => {
    const locale = 'en';
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.id',
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
      orderBy: 'definition.id',
    });

    await expect(controller.find('', {}, pageOptionsDto)).rejects.toThrow();
  });

  it('should return a transformed paginated result via the interceptor', async () => {
    const locale = 'en';
    const query: RetrieveResourceFilter = { resourceType: 1 };
    const pageOptionsDto = new PageOptionsDto({
      take: 1,
      page: 1,
      order: 'ASC',
      orderBy: 'definition.id',
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
    expect(transformedResponse.data![0].definition).toHaveProperty('id');
    expect(transformedResponse.data![0]).toHaveProperty('title');
    expect(transformedResponse.meta!.page).toEqual(1);
    expect(transformedResponse.meta!.itemCount).toEqual(1);
    expect(transformedResponse.meta!.totalCount).toEqual(3);
    expect(transformedResponse.meta!.hasPreviousPage).toBe(false);
    expect(transformedResponse.meta!.hasNextPage).toBe(true);
  });

  it('should return error when the locale is not provided but query is', async () => {
    const locale = '' as any;
    const query: RetrieveResourceFilter = {
      resourceType: 1,
    };
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'id',
    });

    await expect(
      controller.find(locale, query, pageOptionsDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return an error if page is negative', async () => {
    const locale = 'en';
    const query: RetrieveResourceFilter = {
      resourceType: 1,
    };

    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: -1,
      order: 'ASC',
      orderBy: 'id',
    });

    await expect(
      controller.find(locale, query, pageOptionsDto),
    ).rejects.toThrow(BadRequestException);
  });

});
