import { Module } from '@nestjs/common';
import { TestService } from '../service/test.service';
import { TestController } from '../controller/test.controller';

@Module({
  providers: [
    TestService,
  ],
  controllers: [ TestController ],
})
export class TestModule {
}
