import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Observable, throwError } from 'rxjs';
import { Metadata } from 'grpc';
import { Request } from 'express';

import { LogService } from '@Log/log.service';
import { IRequestHandler } from '@Helper/helper';

import { example } from '../../../example/grpc-server/src/proto';
import ExampleService = example.ExampleService;
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class TestService {
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

  requestGRPCWrapper<T>(req: Request, requestHandler: IRequestHandler<T>): IRequestHandler<T> {
    return (...args: any[]): Observable<T> => {
      LogService.info(`Enter Service: traceId: ${ req.traceId }; serviceName: ${ this.constructor.name }.${ requestHandler.name }; parameters: ${ JSON.stringify(args) }`);

      const metadata = new Metadata();
      metadata.set('Trace-id', req.traceId);
      metadata.set('Span-Id', req.spanId + '.1');

      return requestHandler.call(this, metadata, ...args).pipe(
        tap(
          (value: T) => {
            if (req && req.query && req.query.DEBUG) {
              LogService.debug(`Leave Service: traceId: ${ req.traceId }; serviceName: ${ this.constructor.name }.${ requestHandler.name }; response: ${ JSON.stringify(value) }`, true);
            } else {
              LogService.info(`Leave Service: traceId: ${ req.traceId }; serviceName: ${ this.constructor.name }.${ requestHandler.name };`);
            }
            return value;
          },
        ),
        catchError(
          err => {
            LogService.info(`Leave Service Error: traceId: ${ req.traceId }; serviceName: ${ this.constructor.name }.${ requestHandler.name };`);
            return throwError(err);
          },
        ),
      );
    };
  }

  indexExample(metadata: Metadata): Observable<any> {
    return this.exampleRpcService.searchExample({ id: 1 }, metadata);
  }
}
