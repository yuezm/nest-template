import { Test, TestingModule } from '@nestjs/testing';
import { TestController } from '../../src/core/controller/test.controller';
import { TestService } from '../../src/core/service/test.service';

describe('Test Controller', () => {
  let testController: TestController;
  let testService: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ TestController ],
      providers: [ TestService ],
    }).compile();

    testController = module.get<TestController>(TestController);
    testService = module.get<TestService>(TestService);
  });

  it('testController index', async () => {
    expect(
      await testController.index(),
    ).toStrictEqual({
      message: 'Hello nest',
    });
  });
});
