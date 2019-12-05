import { Server } from 'http';
import ErrnoException = NodeJS.ErrnoException;
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
  httpListening(app.getHttpServer(), ConfigService.get('HTTP_PORT'));
}

function httpListening(server: Server, port: number) {
  server.on('error', (err: ErrnoException) => {
    // 端口重复监听错误
    if (err.code === 'EADDRINUSE' && process.env.NODE_ENV !== 'production') {
      Logger.warn(`端口重复监听：${ port }`);
      server.listen(++port);
    } else {
      Logger.error(err);
    }
  });

  server.on('listening', () => {
    Logger.log(`启动成功，监听：0.0.0.0:${ port }`);
  });
}

bootstrap();

// -------------------------------- 错误处理 --------------------------------
process.on('unhandledRejection', err => {
  Logger.warn(err as Error);
});

process.on('uncaughtException', err => {
  // 终止服务，让pm2重启
  Logger.error(err);
  process.exit(1);
});
