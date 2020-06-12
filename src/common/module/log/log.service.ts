import { join } from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as dayJs from 'dayjs';

import { ConfigService } from '@Config/config.service';

const { combine, printf } = format;

export type ErrorType = Error | string | unknown;

const winstonLogger: WinstonLogger = createLogger({
  format: combine(
    printf(
      // 日志信息格式化
      info => `${ dayJs().format('YYYY-MM-DD HH:mm:ss') } [${ info.level.toUpperCase() }] ${ info.message }`,
    ),
  ),
  transports: [
    // 控制台配置
    new transports.Console({
      level: ConfigService.get('LOG_CMD_LEVEL'),
      handleExceptions: true,
    }),

    // 日志文件配置
    new DailyRotateFile({
      level: ConfigService.get('LOG_FILE_LEVEL'),
      filename: join(ConfigService.get('LOG_PATH'), '%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false, // 是否压缩日志文件
      maxSize: '200m',
      maxFiles: '30d',
    }),
  ],
});

@Injectable()
export class LogService {
  static debug(message: ErrorType, on = false): WinstonLogger {
    if (on) {
      return LogService.info(message);
    } else {
      return winstonLogger.debug(LogService.serialize(message));
    }
  }

  debug(message: ErrorType, on = false): WinstonLogger {
    return LogService.debug(message, on);
  }

  static info(message: ErrorType): WinstonLogger {
    return winstonLogger.info(LogService.serialize(message));
  }

  info(message: ErrorType): WinstonLogger {
    return LogService.info(message);
  }

  static warn(message: ErrorType): WinstonLogger {
    return winstonLogger.warn(LogService.serialize(message));
  }

  warn(message: ErrorType): WinstonLogger {
    return LogService.warn(message);
  }

  static error(message: ErrorType): WinstonLogger {
    return winstonLogger.error(LogService.serialize(message));
  }

  error(message: ErrorType): WinstonLogger {
    return LogService.error(message);
  }

  static serialize(msg: ErrorType): string {
    if (typeof msg === 'string') {
      return msg;
    }

    if (msg instanceof Error) {
      return msg.stack;
    }

    return JSON.stringify(msg);
  }
}

Logger.log('LogService加载成功');
