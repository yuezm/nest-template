import { BaseService, IRequestHandler } from './base.service';
import { of, throwError } from 'rxjs';
import { Metadata } from 'grpc';

describe('Test base service', function() {
  const req = { spanId: '0', traceId: '1111', query: {} };
  const requestHandle: IRequestHandler<any> = function(metadata: Metadata, isError?: boolean) {
    return isError ? throwError('error') : of(metadata);
  };

  const baseService = new BaseService();
  (baseService as any).requestHandle = requestHandle;

  it('should return right value', function() {
    baseService.requestGRPCWrapper<Metadata>(req as any, (baseService as any).requestHandle)().subscribe(
      (value: Metadata) => {
        expect(value.get('spanId')).toEqual('0.1');
        expect(value.get('traceId')).toEqual('1111');
      },
    );
  });

  it('should return right value debug mode', function() {
    (req.query as any).DEBUG = 1;
    baseService.requestGRPCWrapper<Metadata>(req as any, (baseService as any).requestHandle)().subscribe(
      (value: Metadata) => {
        expect(value.get('spanId')).toBe('0.1');
        expect(value.get('traceId')).toBe('1111');
      },
    );
  });

  it('should return right value catch error', function() {
    (req.query as any).DEBUG = 1;
    baseService.requestGRPCWrapper<Metadata>(req as any, (baseService as any).requestHandle)(true).subscribe(
      (value: Metadata) => {
      },
      error => {
        expect(error).toBe('error');
      },
    );
  });
});
