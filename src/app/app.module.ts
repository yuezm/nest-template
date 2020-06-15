import { Global, Logger, MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AllExceptionFilter } from '@Common/filter/all.exception.filter';
import { ResponseInterceptor } from '@Common/interceptor/response.interceptor';
import { AuthGuards } from '@Common/guards/auth.guards';
import { EntryMiddleWare } from '@Common/middware/entry.middware';

import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [
    UserModule,
  ],
providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuards,
    },
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
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(EntryMiddleWare)
      .forRoutes('/');
  }
}

Logger.log('AppModule 加载成功');
