import { Observable, of } from 'rxjs';
import { IsString, validate } from 'class-validator';
import { Expose, plainToClass } from 'class-transformer';

import { Log } from '@Common/decorator/common.decorator';
import { readFileLastLine } from '../../../test/test.util';
import { Default, ValidateIfNotEmpty } from '@Common/decorator/transform.decorator';

describe('Test common.decorator.ts', () => {
  let test;
  const returnMsg = 'Hello Word!!!';

  beforeAll(() => {
    class Test {
      @Log()
      test(req?: any): string {
        return returnMsg;
      }

      @Log()
      testPromise(req?: any): Promise<string> {
        return Promise.resolve(returnMsg);
      }

      @Log()
      testObservable(req?: any): Observable<string> {
        return of(returnMsg);
      }
    }

    test = new Test();
  });

  it('Test Log decorator normal', () => {
    expect(test.test({ traceId: 'test_request_id' })).toBe(returnMsg);

    expect(/^d{4}-d{2}-d{2} d{2}:d{2}:d{2} [INFO] Enter Service.*$/.test(readFileLastLine(-2)));
    expect(/^d{4}-d{2}-d{2} d{2}:d{2}:d{2} [INFO] Leave Service.*$/.test(readFileLastLine()));
  });

  it('Test Log decorator 无请求对象', () => {
    test.test();
    expect(/^d{4}-d{2}-d{2} d{2}:d{2}:d{2} [INFO] Enter Service.*$/.test(readFileLastLine(-2)));
    expect(/^d{4}-d{2}-d{2} d{2}:d{2}:d{2} [INFO] Leave Service.*$/.test(readFileLastLine()));
  });

  it('Test Log decorator promise', () => {
    test.testPromise({ traceId: 'test_request_id', query: { DEBUG: 1 } }).then(value => {
      expect(value).toBe(returnMsg);
    });

    expect(/^d{4}-d{2}-d{2} d{2}:d{2}:d{2} [DEBUG] Leave Service : traceId: test_request_id; serviceName: Test.testPromise; response: "Hello Word!!!$/
      .test(readFileLastLine()));
  });

  it('Test Log decorator observable', () => {
    test.testObservable({ traceId: 'test_request_id', query: { DEBUG: 1 } }).subscribe(value => {
      expect(value === 'Hello Word!!!');
    });

    expect(/^d{4}-d{2}-d{2} d{2}:d{2}:d{2} [DEBUG] Leave Service : traceId: test_request_id; serviceName: Test.Test.testObservable; response: "Hello Word!!!$/
      .test(readFileLastLine()));
  });
});

describe('Test transform.decorator.ts', () => {
  class Test {
    @Expose()
    @Default(1)
    id: number;

    @ValidateIfNotEmpty()
    @IsString()
    name: string;
  }

  it('Test Default', function() {
    const testObject = { name: null, age: null };
    expect(plainToClass(Test, testObject).id).toBe(1);
  });

  it('Test ValidateIfNotEmpty', () => {
    const resultClass = plainToClass(Test, { name: null });
    validate(resultClass).then(errors => {
      expect(errors.length === 0).toBeTruthy();
    });
  });
});
