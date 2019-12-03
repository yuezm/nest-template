import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerBaseConfig, SwaggerDocument } from '@nestjs/swagger';
import * as cookieParse from 'cookie-parser';
import * as helmet from 'helmet';

import './boot';
import { AppModule } from '@App/app.module';

import { LogService } from '@Log/log.service';
import { ConfigService } from '@Config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });

  //  -------------------------------- 配置swagger文档 --------------------------------
  const documentOptions: SwaggerBaseConfig = new DocumentBuilder()
    .setTitle('nest-template')
    .setDescription('nest-template API')
    .setVersion(process.env.npm_package_version)
    .setBasePath('/api')
    .build();

  const document: SwaggerDocument = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('api/swagger', app, document);

  // -------------------------------- nest中间件及其他配置 --------------------------------
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('/api');
  app.useLogger(app.get('LogService'));
  app.use(helmet());
  app.use(cookieParse('session-secret'));
  await app.listen(ConfigService.get('HTTP_PORT'));
}

// -------------------------------- 启动日志 --------------------------------
bootstrap().then(() => {
  Logger.log(`启动成功，监听端口：0.0.0.0:${ConfigService.get('HTTP_PORT')}`);
}).catch(reason => {
  Logger.log(reason);
});

// -------------------------------- 错误处理 --------------------------------
process.on('unhandledRejection', err => {
  Logger.warn(err as Error);
});

process.on('uncaughtException', err => {
  Logger.error(err);
  process.exit(1);
});
