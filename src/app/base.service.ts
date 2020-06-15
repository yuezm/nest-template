import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { LogService } from '@Log/log.service';
import { Metadata } from 'grpc';
import { catchError, tap } from 'rxjs/operators';

export type IRequestHandler<T> = (metadata: Metadata, ...args) => Observable<T>;
export type IRequestHandlerWrapper<T> = (...args) => Observable<T>;

@Injectable()
export class BaseService {
  requestGRPCWrapper<T>(req: Request, requestHandler: IRequestHandler<T>): IRequestHandlerWrapper<T> {
    return (...args: any[]): Observable<T> => {
      LogService.info(`Enter Service: traceId: ${ req.traceId }; serviceName: ${ this.constructor.name }.${ requestHandler.name }; parameters: ${ JSON.stringify(args) }`);

      const metadata = new Metadata();
      metadata.set('Trace-id', req.traceId);
      metadata.set('Span-Id', req.spanId + '.1');

      return requestHandler.call(this, metadata, ...args).pipe(
        tap(
          (value: T) => {
            if (req.query?.DEBUG) {
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
}
