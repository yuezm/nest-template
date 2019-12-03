import { Global, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AllExceptionFilter } from '@Common/filter/all.exception.filter';
import { ResponseInterceptor } from '@Common/interceptor/response.interceptor';
import { AuthGuards } from '@Common/guards/auth.guards';

import { UserModule } from './user/user.module';
import { LogModule } from '@Log/log.module';

@Global()
@Module({
  imports: [
    LogModule,

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
  exports: [
    LogModule,
  ],
})
export class AppModule {
}
