import 'reflect-metadata';
import { types } from 'util';
import { isObservable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LogService } from '@Log/log.service';
import { IRequest } from '@App/app.interface';


function makeLeaveServiceLog(req: IRequest, name: string, value: object | string | number | boolean): void {
  if (req && req.query && req.query.DEBUG) {
    LogService.debug(`Leave Service: requestId: ${ req.requestId }; serviceName: ${ name }; response: ${ JSON.stringify(value) }`);
  } else {
    LogService.info(`Leave Service: requestId: ${ req.requestId }; serviceName: ${ name };`);
  }
}

export function Log(): MethodDecorator {
  return function <T>(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): void {
    const handler: Function = descriptor.value as any;

    (descriptor.value as any) = function(req: IRequest | any = {}, ...args): any {
      LogService.info(`Enter Service: requestId: ${ req.requestId }; serviceName: ${ target.constructor.name }.${ propertyKey }; parameters: ${ JSON.stringify(args) }`);

      const result: any = handler.call(target, req, ...args);

      if (types.isPromise(result)) {
        return result.then((value: any) => {
          makeLeaveServiceLog(req, `${ target.constructor.name }.${ propertyKey }`, value);
          return value;
        });
      }

      if (isObservable(result)) {
        return result.pipe(
          map(
            (value: any) => {
              makeLeaveServiceLog(req, `${ target.constructor.name }.${ propertyKey }`, value);
              return value;
            },
          ),
        );
      }

      makeLeaveServiceLog(req, `${ target.constructor.name }.${ propertyKey }`, result);
      return result;
    };

    Reflect.defineMetadata('NORMAL_LOG', 'NORMAL_LOG', target, propertyKey);
  };
}
