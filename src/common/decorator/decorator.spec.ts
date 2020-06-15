import { IsString, validate } from 'class-validator';
import { Expose, plainToClass } from 'class-transformer';

import { Default, ValidateIfNotEmpty } from '@Common/decorator/transform.decorator';

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
