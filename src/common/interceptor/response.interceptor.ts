import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

import { LogService } from '@Log/log.service';
import { EmptyDto } from '@App/app.dto';
import { RESPONSE_SERIALIZE } from '@Common/decorator/transform.decorator';
import { IRequest, IResponseInterceptor } from '@App/app.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly logService: LogService,
    private readonly reflector: Reflector,
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const req: IRequest = context.switchToHttp().getRequest();

    return next
      .handle()
      .pipe(
        map<any, IResponseInterceptor>(
          value => {
            LogService.info(`Leave Service: requestId=${ req.requestId }`);

            const cls = this.reflector.get(RESPONSE_SERIALIZE, context.getHandler());
            // 凡是不含 RESPONSE_SERIALIZE 的，则认为需要自己序列化返回值
            if (!cls) {
              return value;
            }

            return {
              errcode: 0,
              errmsg: '',
              data: cls === EmptyDto ? {} : plainToClass(cls, value, { excludeExtraneousValues: true }),
            };
          },
        ),
      );
  }
}
