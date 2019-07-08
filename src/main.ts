import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import * as cookieParse from 'cookie-parser';
import * as helmet from 'helmet';
import * as csurf from 'csurf';

dotenv.config();

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  // ---- 安全 ----
  app.use(helmet());
  app.enableCors();
  app.use(cookieParse());
  app.use(csurf({ cookie: true }));

  // ---- 自定义日志 -----
  app.useLogger(app.get('LogService'));
  await app.listen(process.env.NODE_ENV === 'production' ? 80 : 7001);
}

bootstrap();
