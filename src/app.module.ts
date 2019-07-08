import { Global, Module } from '@nestjs/common';
import { TestModule } from './core/module/test.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HTTPExceptionFilter } from './provider/filter/exception.filter';
import { LogService } from './provider/service/log.service';
import { AuthGuards } from './provider/guards/auth.guards';

@Global()
@Module({
  imports: [
    TestModule,
  ],
  providers: [
    LogService,
    {
      provide: APP_FILTER,
      useClass: HTTPExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuards,
    },
  ],
  exports: [
    LogService,
  ],
})
export class AppModule {
}
