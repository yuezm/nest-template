import { Catch, ArgumentsHost, HttpStatus, HttpException, BadRequestException } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';

import { LogService } from '@Log/log.service';
import { IRequest } from '@App/app.interface';

@Catch()
export class AllExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    super.catch(exception, host);

    const ctx: HttpArgumentsHost = host.switchToHttp();
    const res: Response = ctx.getResponse();
    const req: IRequest = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;

      // 单独处理 参数校验错误
      if (exception instanceof BadRequestException) {
        const messages: any | any[] = (exception.getResponse() as any).message;
        message = Array.isArray(messages) ? messages[ 0 ] : message;
      }

      LogService.info(`HttpError: requestId=${ req.requestId }, Trace=${ exception.stack }`);
    } else {
      LogService.warn(`Error: requestId=${ req.requestId }, Trace=${ exception.stack }`);
    }

    res.status(200)
      .json({
        errmsg: message,
        errcode: status,
      });
  }
}
