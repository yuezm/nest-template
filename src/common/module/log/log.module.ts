import { Module } from '@nestjs/common';

import { LogService } from './log.service';
import { ConfigModule } from '@Config/config.module';

@Module({
  imports: [ ConfigModule ],
  providers: [ LogService ],
  exports: [ LogService ],
})
export class LogModule {
}
