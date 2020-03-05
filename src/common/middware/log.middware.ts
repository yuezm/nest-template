import * as uuid from 'uuid/v4';
import { Injectable, NestMiddleware } from '@nestjs/common';

import { IRequest } from '@App/app.interface';
import { LogService } from '@Log/log.service';

@Injectable()
export class LogMiddleWare implements NestMiddleware {
  use(req: IRequest, res: Response, next: () => void): any {
    req.requestId = uuid();

    LogService.info(`Enter Server: requestId=${ req.requestId }, path=${ req.url }, method=${ req.method }, params=${ JSON.stringify((req as any).query) }, body=${ JSON.stringify(req.body) }`);

    next();
  }
}
