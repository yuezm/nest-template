import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';

import { LogService } from '@Log/log.service';
import { EmptyDto } from '@App/app.dto';
import { RESPONSE_SERIALIZE } from '@Common/decorator/transform.decorator';
import { IResponse } from '@App/app.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest();

    return next
      .handle()
      .pipe(
        map<any, IResponse>(
          value => {
            LogService.info(`Leave Server: traceId=${ req.traceId }`);

            const cls = this.reflector.get(RESPONSE_SERIALIZE, context.getHandler());
            // 凡是不含 RESPONSE_SERIALIZE 的，则认为需要自己序列化返回值
            if (!cls) {
              return value;
            }

            return {
              errcode: 0,
              errmsg: '',
              traceId: req.traceId,
              data: cls === EmptyDto ? {} : plainToClass(cls, value, { excludeExtraneousValues: true }),
            } as IResponse;
          },
        ),
      );
  }
}
