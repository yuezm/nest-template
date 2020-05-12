import { join } from 'path';
import { readFileSync } from 'fs';
import dayjs = require('dayjs');

import { ConfigService } from '@Config/config.service';

// 日志文件路径，由于日期的变化，日志路径会改变
const logFilePath = join(ConfigService.get('LOG_PATH'), `${ dayjs().format('YYYY-MM-DD') }.log`);

// 获取文件倒数第n行-1 为最后一行，-2位倒数第二行，以此类推
export function readFileLastLine(lastNumber = -1): string {
  const lineArr = readFileSync(logFilePath).toString().split('\n');
  return lineArr[ lineArr.length + lastNumber - 1 ]; // 最后一行为""，所以得再-1
}
