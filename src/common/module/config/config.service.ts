/**
 * 普通配置及环境变量配置服务
 *
 * 如果config.ts 与 .env 属性名重复，则以.env为准
 */
import { join } from 'path';
import { readFileSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { parse } from 'dotenv';

import defaultConfig from '@Src/config';

const config: any = Object.assign(
  defaultConfig,
  parse(readFileSync(join(process.cwd(), '.env'))),
);

@Injectable()
export class ConfigService {
  get(key: string) {
    return ConfigService.get(key);
  }

  static get(key: string) {
    return config[ key ] || process.env[ key ];
  }
}
