import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '@App/app.module';

describe('TestController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ AppModule ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });


  it('/api/v1/test 参数校验报错', () => {
    return request(app.getHttpServer())
      .get('/v1/test')
      .expect(200)
      .expect(res => {
        return res.body.errmsg === 'ID 必须为整数' && res.body.errcode === 400;
      });
  });

  it('/api/v1/test 正确返回', () => {
    return request(app.getHttpServer())
      .get('/v1/test?id=1')
      .expect(200)
      .expect(res => res.body.data === 'Hello World!');
  });

  it('/api/v1/test/no-ser 正确返回 不序列化返回值', () => {
    return request(app.getHttpServer())
      .get('/v1/test/no-ser')
      .expect(200)
      .expect(res => res.body === 'Hello World!');
  });

  it('/api/v1/test/no-ser 正确返回 且序列化为空对象', () => {
    return request(app.getHttpServer())
      .get('/v1/test/empty')
      .expect(200)
      .expect(res => {
        return JSON.stringify(res.body.data) === '{}';
      });
  });

  it('/api/v1/test/bad-request 自定义参数异常报错', () => {
    return request(app.getHttpServer())
      .get('/v1/test/bad-request')
      .expect(200)
      .expect(res => {
        return res.body.errmsg === 'Bad Request!' && res.body.errcode === 400;
      });
  });

  it('/v1/test/http-exception HTTP异常', () => {
    return request(app.getHttpServer())
      .get('/v1/test/http-exception')
      .expect(200)
      .expect(res => {
        return res.body.errmsg === 'HTTP Exception!' && res.body.errcode === 403;
      });
  });

  it('/api/v1/test/error 普通Error', () => {
    return request(app.getHttpServer())
      .get('/v1/test/error')
      .expect(200)
      .expect(res => {
        return res.body.errmsg === '服务器错误' && res.body.errcode === 500;
      });
  });

  it('/api/v1/test/auth 登录拦截报错', () => {
    return request(app.getHttpServer())
      .get('/v1/test/auth')
      .expect(200)
      .expect(res => {
        return res.body.errmsg === '您未登录，请先登录' && res.body.errcode === 401;
      });
  });

  it('/api/v1/test/auth 登录成功', () => {
    return request(app.getHttpServer())
      .get('/v1/test/auth?name=test')
      .expect(200)
      .expect(res => {
        return res.body.errmsg === 'Hello World!' && res.body.errcode === 0;
      });
  });
});
