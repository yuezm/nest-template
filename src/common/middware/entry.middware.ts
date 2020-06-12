import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { v1 } from 'uuid';

import { LogService } from '@Log/log.service';

@Injectable()
export class EntryMiddleWare implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): any {
    req.traceId = req.headers[ 'Trace-Id' ] || v1();
    req.spanId = req.headers[ 'Span-Id' ] || '0';

    LogService.info(`Enter Server: traceId=${ req.traceId }, path=${ req.url }, method=${ req.method }, query=${ JSON.stringify(req.query) }, body=${ JSON.stringify(req.body) }`);

    next();
  }
}
