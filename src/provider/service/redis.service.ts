import { Injectable } from '@nestjs/common';
import * as redis from 'redis';
import { RedisClient } from 'redis';
import { promisify } from 'util';

const keys: string[] = [ 'get', 'set', 'hset', 'hget' ];

@Injectable()
export class RedisService {
  public redis: RedisClient;

  constructor() {
    const { REDIS_PORT, REDIS_HOST, REDIS_DB } = process.env;
    const redisClient: RedisClient = redis.createClient({
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
      db: REDIS_DB,
    });

    keys.forEach((key: string) => {
      redisClient[ key ] = promisify(redisClient[ key ]).bind(redisClient);
    });

    this.redis = redisClient;
  }
}
