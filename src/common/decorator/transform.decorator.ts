/**
 * class-transform 的补充装饰器
 */
import { ApiOkResponse } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { ValidateIf } from 'class-validator';

import { isEmpty, isNotEmpty } from '@Src/helper';

export const RESPONSE_SERIALIZE = Symbol('RESPONSE_SERIALIZE');

// class-transformer 扩展装饰器-设置属性的默认值
export function Default(defaultValue: any): (target: any, key: string) => void {
  return Transform((value: any) => (isEmpty(value) ? defaultValue : value));
}

// class-validator 扩展装饰器，扩展校验条件（其实是对 IsOptional 的扩展）
export function ValidateIfNotEmpty(): (object: object, propertyName: string) => void {
  return ValidateIf(((object, value) => isNotEmpty(value)));
}

/**
 * response serialize 扩展返回值序列化 [ 且自动将swagger response设为该ClassType ]
 * 使用方式
 * @ResponseSerialize(ResponseDto)
 * index(){...}
 */
export function ResponseSerialize<T>(cls: ClassType<T>, isSwaggerResponse = false): MethodDecorator {
  return (target, propertyKey, descriptor: TypedPropertyDescriptor<any>): void => {
    if (isSwaggerResponse) {
        ApiOkResponse({ type: cls })(target, propertyKey, descriptor);
    }
    Reflect.defineMetadata(RESPONSE_SERIALIZE, cls, descriptor.value);
  };
}
