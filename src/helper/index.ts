import { join } from 'path';
import { ClientOptions, Transport } from '@nestjs/microservices';
import * as dayJs from 'dayjs';

import { IGRPCClientOption } from '@Helper/helper.interface';

// -------------------------------------- 通用 --------------------------------------

// 空校验
export function isEmpty(value: any): boolean {
  return value === '' || value === undefined || value === null;
}

// 非空校验
export function isNotEmpty(value: any): boolean {
  return !isEmpty(value);
}

// ------------------------------ 数据格式转换  ------------------------------

// 将js数据类型转换为 google 数据类型，例如将 number 转换为 Int64Value
export function transToGoogleType(value: number | string | boolean): object {
  return isEmpty(value) ? null : { value };
}

/**
 * 将其他时间格式转为13位时间戳
 * 将时间对象格式化
 * 将时间格式字符串转为13位时间戳
 * 将10位时间戳转为13位时间戳，如果时间戳已为13位，概不负责
 */
export function transDateToTimestamp(date: string | number | Date): number {
  if (!date || date <= 0) {
    return;
  }
  if (typeof date === 'object') {
    return date.getTime();
  }

  return typeof date === 'number' ? date * 1000 : new Date(date).getTime();
}

/**
 * 将其他时间格式转为时间字符串
 * 将时间对象格式化
 * 将时间格式字符串格式化（主要目的为去除毫秒和时区）
 * 将时间戳为格式化
 * 10位（秒时间戳）最大值 9999999999 到2286年了，足矣
 */
export function transDateToDateString(date: number | string | Date): string {
  if (!date || date <= 0) {
    return;
  }

  // 检测 numeric 类型
  if (!Number.isNaN(Number(date))) {
    date = Number(date);
  }

  if (typeof date === 'number' && date < 9999999999) {
    date *= 1000;
  }

  return dayJs(date).format('YYYY-MM-DD HH:mm:ss');
}

// 格式化数字货币（将分表示转换为元表示，tips 实在不知道"元"用什么英文单词）
export function transPriceToYuan(price: number) {
  if (isEmpty(price)) {
    return undefined;
  }
  return (price / 100).toFixed(2);
}

// ------------------------------ 数据格式化 ------------------------------

// ------------------------------ gRPC ------------------------------

/**
 * 提供gRPC客户端、服务端proto配置
 * @param {string} url ,请求/监听地址，如果不赋值，nest 默认为 localhost:5000
 * @param {string} packageName，*.proto文件的package
 * @param {string} protoPath，*.proto文件的路径，路径以"protocol/"开始计算
 */
export function getGRPCClientOption({ url, package: packageName, protoPath }: IGRPCClientOption): ClientOptions {
  return {
    transport: Transport.GRPC,
    options: {
      url,
      package: packageName,
      protoPath,
      loader: {
        includeDirs: [ join(process.cwd(), 'protocol') ],
        json: true,
      },
    },
  };
}

// ------------------------------ gRPC ------------------------------
