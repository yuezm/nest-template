import { MiddlewareConsumer, Module } from '@nestjs/common';

import { TestController } from './test.controller';
import { TestService } from './test.service';
import { LogMiddleWare } from '@Common/middware/log.middware';

@Module({
  controllers: [ TestController ],
  providers: [ TestService ],
})
export class TestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LogMiddleWare)
      .forRoutes('/');
  }
}
