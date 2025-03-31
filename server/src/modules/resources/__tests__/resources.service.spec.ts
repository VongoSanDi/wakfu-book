import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesService } from '../resources.service';
import { Model } from 'mongoose';
import { Resource, ResourceSchema } from '../schemas/resource.schema';
import { closeTestDB, initTestDB } from '../../../common/__tests__/db.setup';
import { mockResourcesData } from './mock-resources-data';
import { getModelToken } from '@nestjs/mongoose';

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
});
