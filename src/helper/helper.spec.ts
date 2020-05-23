import { Test, TestingModule } from '@nestjs/testing';
import { GrpcOptions, Transport } from '@nestjs/microservices';

import {
  getGRPCClientOption,
  isEmpty,
  isNotEmpty,
  transDateToDateString,
  transDateToTimestamp,
  transPriceToYuan,
  transStringToJson,
  transToGoogleType,
} from './helper';
import { AppModule } from '@App/app.module';
import { resolve } from 'path';

describe('Helper Test', () => {
  let app;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ AppModule ],
    }).compile();
    app = moduleFixture.createNestMicroservice({});
    await app.init();
  });

  test('Test isEmpty', () => {
    [ undefined, null, '' ].forEach(value => expect(isEmpty(value)).toBe(true));

    [ false, 0 ].forEach(value => expect(isEmpty(value)).toBe(false));
  });

  test('Test isNotEmpty', () => {
    [ undefined, null, '' ].forEach(value => expect(isNotEmpty(value)).toBe(false));

    [ false, 0 ].forEach(value => expect(isNotEmpty(value)).toBe(true));
  });

  test('Test transToGoogleType', () => {
    [ undefined, null, '' ].forEach(value => expect(transToGoogleType(value)).toBe(null));

    expect(transToGoogleType(1)).toEqual({ value: 1 });
    expect(transToGoogleType('TEST')).toEqual({ value: 'TEST' });
    expect(transToGoogleType(true)).toEqual({ value: true });
  });

  test('Test transDateToTimestamp', () => {
    [ undefined, null, '', 0, -1 ].forEach(value => expect(transDateToTimestamp(value)).toBe(undefined));

    [ '2020-01-01 00:00:00', new Date('2020-01-01 00:00:00'), 1577808000000, 1577808000 ]
      .forEach(value => expect(transDateToTimestamp(value)).toBe(1577808000000));
  });

  test('Test transDateToDateString', () => {
    [ undefined, null, '', 0, -1 ].forEach(value => expect(transDateToDateString(value)).toBe(undefined));

    [ '2020-01-01', new Date('2020-01-01 00:00:00'), 1577808000000, 1577808000 ]
      .forEach(value => expect(transDateToDateString(value)).toBe('2020-01-01 00:00:00'));
  });

  test('Test transPriceToYuan', () => {
    [ null, undefined ].forEach(value => expect(transPriceToYuan(value)).toBe(null));

    expect(transPriceToYuan(0)).toBe('0.00');
    expect(transPriceToYuan(1)).toBe('0.01');
  });

  test('Test transStringToJson', () => {
    [ null, undefined ].forEach(value => expect(transStringToJson(value)).toBe(null));

    expect(transStringToJson('{"name":"Test"}')).toEqual({ name: 'Test' });
  });

  test('Test getGRPCClientOption', () => {
    const url = 'localhost:5000';
    const packageName = 'test';
    const protoPath = '/test';

    const gRpcOptions: GrpcOptions = getGRPCClientOption({ url, package: packageName, protoPath });

    expect(gRpcOptions.transport).toBe(Transport.GRPC);
    expect(gRpcOptions.options.url).toBe(url);
    expect(gRpcOptions.options.package).toBe(packageName);
    expect(gRpcOptions.options.protoPath).toBe(protoPath);
    expect(gRpcOptions.options.loader.includeDirs).toContainEqual(resolve('protocol'));
  });
});
