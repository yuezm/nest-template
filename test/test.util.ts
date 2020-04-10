import { join } from 'path';
import { ConfigService } from '@Config/config.service';
import { readFileSync } from 'fs';
import dayjs = require('dayjs');

const logFilePath = join(ConfigService.get('LOG_PATH'), `${ dayjs().format('YYYY-MM-DD') }.log`);

// -1 为最后一行，-2位倒数第二行，以此类推
export function readFileLastLine(lastNumber = -1): string {
  const lineArr = readFileSync(logFilePath).toString().split('\n');
  return lineArr[ lineArr.length + lastNumber - 1 ]; // 最后一行为""，所以得再-1
}
