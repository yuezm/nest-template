import { IUserInfo } from '@App/app.interface';

declare module 'http' {
  interface IncomingHttpHeaders {
    'Span-Id'?: string;
    'Trace-Id'?: string;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    spanId?: string;
    traceId?: string;
    userInfo?: IUserInfo;
  }
}

