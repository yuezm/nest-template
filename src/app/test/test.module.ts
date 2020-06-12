import { MiddlewareConsumer, Module } from '@nestjs/common';

import { TestController } from './test.controller';
import { TestService } from './test.service';
import { EntryMiddleWare } from '@Common/middware/entry.middware';

@Module({
  controllers: [ TestController ],
  providers: [ TestService ],
})
export class TestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(EntryMiddleWare)
      .forRoutes('/');
  }
}
