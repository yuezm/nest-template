import { join } from 'path';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import * as dayJs from 'dayjs';

import { IGRPCClientOption } from './helper.interface';

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
export function transStringToJson(data: string): object | null {
  return isEmpty(data) ? null : JSON.parse(data);
}

// ------------------------------ 数据格式化 ------------------------------

// ------------------------------ gRPC ------------------------------

/**
 * 提供gRPC客户端、服务端proto配置
 * @param {string} url ,请求/监听地址，如果不赋值，nest 默认为 localhost:5000
 * @param {string} packageName，*.proto文件的package
 * @param {string} protoPath，*.proto文件的路径，路径以"protocol/"开始计算
 */
export function getGRPCClientOption({ url, package: packageName, protoPath }: IGRPCClientOption): GrpcOptions {
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
