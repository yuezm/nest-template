import { Server } from 'http';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import * as cookieParse from 'cookie-parser';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import ErrnoException = NodeJS.ErrnoException;

import './boot'; // !!!启动脚本必须置于首位!!!
import { ConfigService } from '@Config/config.service';
import { AppModule } from '@App/app.module';
import { LogService } from '@Log/log.service';

function httpListening(server: Server, port: number): void {
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

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {});

  // -------------------------------- nest中间件及其他配置 --------------------------------
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('/api');
  app.use(cookieParse('session-secret'));
  app.use(helmet());
  // app.use(csurf());

  //  -------------------------------- 配置swagger文档 --------------------------------
  const documentOptions: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle(process.env.npm_package_name)
    .setDescription(`${ process.env.npm_package_name } API`)
    .setVersion(process.env.npm_package_version)
    .build();

  SwaggerModule.setup('api/swagger', app, SwaggerModule.createDocument(app, documentOptions));

  // -------------------------------- 启动及启动错误捕获 --------------------------------

  await app.listen(ConfigService.get('HTTP_PORT'));
  httpListening(app.getHttpServer(), ConfigService.get('HTTP_PORT'));
}

// -------------------------------- 错误处理 --------------------------------

process.on('unhandledRejection', err => {
  LogService.warn(err as Error);
});

process.on('uncaughtException', err => {
  // 终止服务，让pm2重启
  LogService.error(err);
  process.exit(1);
});

bootstrap();
