import { Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response, Request } from 'express';

import { LogService } from '@Log/log.service';

@Catch()
export class AllExceptionFilter extends BaseRpcExceptionFilter {
  constructor(private readonly logService: LogService) {
    super();
  }

  catch(exception: any, host: ArgumentsHost): any {
    super.catch(exception, host);

    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    exception.request = { path: request.path, body: request.body, query: request.query };

    this.logService.error(exception);

    response.status(200)
      .json({
        errmsg: message,
        errcode: status,
      });
  }
}
