import * as dayJs from 'dayjs';

// 将js数据类型转换为 google 数据类型，例如将 number 转换为 Int64Value
import { isEmpty } from './helper';

export function transToGoogleType(value: number | string | boolean): unknown {
  return isEmpty(value) ? null : { value };
}

// 将其他时间格式转为13位时间戳，请注意是毫秒级时间戳！！！
export function transDateToTimestamp(date: string | number | Date): number {
  if (isEmpty(date)) {
    return;
  }

  if (typeof date === 'object') {
    return date.getTime();
  }

  if (typeof date === 'string') {
    return new Date(date).getTime();
  }

  return date <= 0 ? undefined :
    date < 9999999999 ?
      date * 1000 : date;
}

// 将其他时间格式转为时间字符串，YYYY-MM-DD HH:mm:ss
export function transDateToDateString(date: number | string | Date): string {
  if (isEmpty(date)) {
    return;
  }

  // 检测 numeric 类型
  if (!Number.isNaN(Number(date))) {

    if (date <= 0) {
      return;
    }

    date = Number(date);

    if (date < 9999999999) {
      date *= 1000;
    }
  }

  return dayJs(date).format('YYYY-MM-DD HH:mm:ss');
}

// 格式化数字货币（将分表示转换为元表示，tips 实在不知道"元"用什么英文单词）
export function transPriceToYuan(price: number): string | null {
  return isEmpty(price) ? null : (price / 100).toFixed(2);
}

// 将JSON形式字符串转为JSON
export function transStringToJson(data: string): unknown | null {
  return isEmpty(data) ? null : JSON.parse(data);
}
