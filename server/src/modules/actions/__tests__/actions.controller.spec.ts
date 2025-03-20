import { Test, TestingModule } from '@nestjs/testing';
import { ActionsController } from '../actions.controller';
import { ActionsService } from '../actions.service';
import { Model } from 'mongoose';
import { closeTestDB, initTestDB } from '../../../common/__tests__/db.setup';
import { getModelToken } from '@nestjs/mongoose';
import { Action, ActionSchema } from '../schemas/actions.schema';
import { mockActionsData } from './mock-actions-data';
import { RetrieveActionFilter } from '../validations/actions.validation';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { TransformInterceptor } from '../../../common/interceptors/transform.interceptor';
import { lastValueFrom, of } from 'rxjs';
import { BadRequestException } from '@nestjs/common';

describe('ActionsController', () => {
  let controller: ActionsController;
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
      controllers: [ActionsController],
      providers: [
        ActionsService,
        {
          provide: getModelToken(Action.name),
          useValue: model,
        },
      ],
    }).compile();

    controller = module.get<ActionsController>(ActionsController);
    service = module.get<ActionsService>(ActionsService);
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
      orderBy: 'id',
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
    expect(totalCount).toEqual(5);
    expect(data[0]).toHaveProperty('description');
  });

  it('should return items when query is not provided', async () => {
    const locale = 'en';
    const pageOptionsDto = new PageOptionsDto({
      take: 10,
      page: 1,
      order: 'ASC',
      orderBy: 'id',
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
      orderBy: 'id',
    });

    await expect(controller.find('', {}, pageOptionsDto)).rejects.toThrow();
  });

  it('should return a transformed paginated result via the interceptor', async () => {
    const locale = 'en';
    const query: RetrieveActionFilter = { id: 1 };
    const pageOptionsDto = new PageOptionsDto({
      take: 1,
      page: 1,
      order: 'ASC',
      orderBy: 'id',
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
    expect(transformedResponse.data![0]).toHaveProperty('description');
    expect(transformedResponse.meta!.page).toEqual(1);
    expect(transformedResponse.meta!.itemCount).toEqual(1);
    expect(transformedResponse.meta!.totalCount).toEqual(1);
    expect(transformedResponse.meta!.hasPreviousPage).toBe(false);
    expect(transformedResponse.meta!.hasNextPage).toBe(false);
  });

  it('should return error when the locale is not provided but query is', async () => {
    const locale = '' as any;
    const query: RetrieveActionFilter = {
      id: 1,
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
    const query: RetrieveActionFilter = {
      id: 1,
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
