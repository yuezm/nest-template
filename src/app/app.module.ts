import { Global, Logger, MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { APP_FILTER,  APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AllExceptionFilter } from '@Common/filter/all.exception.filter';
import { ResponseInterceptor } from '@Common/interceptor/response.interceptor';

import { EntryMiddleWare } from '@Common/middware/entry.middware';

import { UserModule } from './user/user.module';
import { TestModule } from '@App/test/test.module';

@Global()
@Module({
  imports: [
    UserModule,
    TestModule,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuards,
    // },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        validationError: {
          value: false,
          target: false,
        },
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
  exports: [
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(EntryMiddleWare)
      .forRoutes('/');
  }
}

Logger.log('AppModule 加载成功');
