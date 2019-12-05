import { isEmpty, isNotEmpty, transDateToDateString, transDateToTimestamp, transPriceToYuan, transStringToJson, transToGoogleType } from './index';

describe('Helper Test', () => {
  test('isEmpty', () => {
    [ undefined, null, '' ].forEach(value => expect(isEmpty(value)).toBe(true));

    [ false, 0 ].forEach(value => expect(isEmpty(value)).toBe(false));
  });

  test('isNotEmpty', () => {
    [ undefined, null, '' ].forEach(value => expect(isNotEmpty(value)).toBe(false));

    [ false, 0 ].forEach(value => expect(isNotEmpty(value)).toBe(true));
  });

  test('transToGoogleType', () => {
    [ undefined, null, '' ].forEach(value => expect(transToGoogleType(value)).toBe(null));

    expect(transToGoogleType(1)).toEqual({ value: 1 });
    expect(transToGoogleType('TEST')).toEqual({ value: 'TEST' });
    expect(transToGoogleType(true)).toEqual({ value: true });
  });

  test('transDateToTimestamp', () => {
    [ undefined, null, '', 0, -1 ].forEach(value => expect(transDateToTimestamp(value)).toBe(undefined));

    [ '2020-01-01 00:00:00', new Date('2020-01-01 00:00:00'), 1577808000000, 1577808000 ]
      .forEach(value => expect(transDateToTimestamp(value)).toBe(1577808000000));
  });

  test('transDateToDateString', () => {
    [ undefined, null, '', 0, -1 ].forEach(value => expect(transDateToDateString(value)).toBe(undefined));

    [ '2020-01-01', new Date('2020-01-01 00:00:00'), 1577808000000, 1577808000 ]
      .forEach(value => expect(transDateToDateString(value)).toBe('2020-01-01 00:00:00'));
  });

  test('transPriceToYuan', () => {
    [ null, undefined ].forEach(value => expect(transPriceToYuan(value)).toBe(null));

    expect(transPriceToYuan(0)).toBe('0.00');
    expect(transPriceToYuan(1)).toBe('0.01');
  });

  test('transStringToJson', () => {
    [ null, undefined ].forEach(value => expect(transStringToJson(value)).toBe(null));

    expect(transStringToJson('{"name":"Test"}')).toEqual({ name: 'Test' });
  });
});
