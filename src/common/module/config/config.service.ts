/**
 * 普通配置及环境变量配置服务
 *
 * 如果config.ts 与 .env 属性名重复，则以.env为准
 */
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { parse } from 'dotenv';

import defaultConfig from '@Src/config';

const envPath = join(process.cwd(), '.env');

const config: object = Object.assign(
  defaultConfig,
  existsSync(envPath) ? parse(readFileSync(envPath)) : null,
);

@Injectable()
export class ConfigService {
  get(key: string): any {
    return ConfigService.get(key);
  }

  static get(key: string): any {
    return config.hasOwnProperty(key) ? config[ key ] : process.env[ key ];
  }
}

Logger.log('ConfigService加载成功');
