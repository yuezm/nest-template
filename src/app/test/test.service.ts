import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Observable } from 'rxjs';
import { Metadata } from 'grpc';
import { BaseService } from '@App/base.service';

import { example } from '../../../example/grpc-server/src/proto';
import ExampleService = example.ExampleService;

@Injectable()
export class TestService extends BaseService {
  private exampleRpcService: ExampleService;

  @Client({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:9001',
      package: 'example',
      protoPath: join(process.cwd(), 'example/grpc-server/proto/example.proto'),
    },
  })
  private readonly client: ClientGrpc;

  onModuleInit(): void {
    this.exampleRpcService = this.client.getService<ExampleService>('ExampleService');
  }

  test(): string {
    return 'Hello World!';
  }

  indexExample(metadata: Metadata): Observable<any> {
    return this.exampleRpcService.searchExample({ id: 1 }, metadata);
  }
}
