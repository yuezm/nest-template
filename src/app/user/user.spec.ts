import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('AppController', () => {
  let userController: UserController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ UserController ],
      providers: [ UserService ],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  describe('Test User', () => {
    it('should return "hello,nest"', () => {
      expect(userController).not.toBeNull();
    });
  });
});
