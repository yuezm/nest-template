import { join } from 'path';
import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as dayJs from 'dayjs';

import { ConfigService } from '@Config/config.service';

const { combine, printf } = format;

export type ErrorType = Error | string | object;

@Injectable()
export class LogService implements LoggerService {

  private readonly logger;

  constructor() {
    this.logger = createLogger({
      format: combine(
        printf(
          // 日志信息格式化
          info => `${ dayJs().format('YYYY-MM-DD HH:mm:ss') } [${ info.level.toUpperCase() }]  ${ info.message }`,
        ),
      ),
      transports: [
        // 控制台配置
        new transports.Console({
          level: 'debug',
          handleExceptions: true,
        }),

        // 日志文件配置
        new DailyRotateFile({
          level: 'warn',
          filename: join(ConfigService.get('LOG_PATH'), '%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false, // 是否压缩日志文件
          maxSize: '200m',
          maxFiles: '30d',
        }),
      ],
    });
  }

  log(message: ErrorType): void {
    this.logger.info(LogService.serialize(message));
  }

  warn(message: ErrorType): void {
    this.logger.warn(LogService.serialize(message));
  }

  error(message: ErrorType): void {
    this.logger.error(LogService.serialize(message));
  }

  debug(message: ErrorType): void {
    this.logger.debug(LogService.serialize(message));
  }

  private static serialize(msg: ErrorType): string {
    if (typeof msg === 'string') {
      return msg;
    }

    if (msg instanceof Error) {
      return msg.stack;
    }

    return JSON.stringify(msg);
  }
}
