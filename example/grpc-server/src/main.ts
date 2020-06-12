import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:9001',
      package: 'example',
      protoPath: join(__dirname, '../proto/example.proto'),
    },
  });
  app.listen(() => console.log('MicroService is listening 9001'));
}

bootstrap();
