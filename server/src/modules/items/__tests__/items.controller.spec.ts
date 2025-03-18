import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from '../items.controller';
import { ItemsService } from '../items.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;
  let model: Model<any>;

  beforeEach(async () => {
    const mockItemModel = {
      find: jest.fn(),
      findOne: jest.fn(),
      countDocuments: jest.fn(),
      create: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        ItemsService,
        {
          provide: getModelToken('Item'),
          useValue: mockItemModel,
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);
    model = module.get<Model<any>>(getModelToken('Item'));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
