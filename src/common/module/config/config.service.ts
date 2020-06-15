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

export type TConfig = typeof defaultConfig | typeof process.env;

const envPath = join(process.cwd(), '.env');
const config: TConfig = existsSync(envPath) ? Object.assign(defaultConfig, parse(readFileSync(envPath))) : defaultConfig;

@Injectable()
export class ConfigService {
  get(key: string): string | number {
    return ConfigService.get(key);
  }

  static get(key: string): string | number {
    return config.hasOwnProperty(key) ? config[ key ] : process.env[ key ];
  }
}

Logger.log('ConfigService加载成功');
