import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { LogService } from '../service/log.service';

@Catch(HttpException)
export class HTTPExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    LogService.warn(JSON.stringify(exception));

    response
      .status(200)
      .json({
        status,
        message: exception.message,
      });
  }
}
