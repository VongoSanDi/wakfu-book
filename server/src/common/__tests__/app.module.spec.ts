import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('AppModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterAll(async () => {
    // Close the connexion to mongodb and any others that were declared in the module
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
