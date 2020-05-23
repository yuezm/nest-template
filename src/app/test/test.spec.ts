import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthGuards } from '@Common/guards/auth.guards';
import { ResponseInterceptor } from '@Common/interceptor/response.interceptor';
import { AllExceptionFilter } from '@Common/filter/all.exception.filter';

import { TestModule } from '@App/test/test.module';
import { UserModule } from '@App/user/user.module';

describe('TestController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ UserModule, TestModule ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuards,
        },
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({
            transform: true,
            validationError: {
              value: false,
              target: false,
            },
          }),
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: ResponseInterceptor,
        },
        {
          provide: APP_FILTER,
          useClass: AllExceptionFilter,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication(null, { logger: false });
    await app.init();
  });

  it('/api/v1/test 参数校验报错', () => {

    return request(app.getHttpServer())
      .get('/v1/test')
      .expect(200)
      .expect(res => {
        expect(res.body.errmsg === 'ID 必须为整数' && res.body.errcode === 400).toBeTruthy();
      });
  });

  it('/api/v1/test 正确返回', () => {
    return request(app.getHttpServer())
      .get('/v1/test?id=1')
      .expect(200)
      .expect(res => expect(res.body.data).toBe('Hello World!'));
  });

  it('/api/v1/test/no-ser 正确返回 不序列化返回值', () => {
    return request(app.getHttpServer())
      .get('/v1/test/no-ser')
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual({});
      });
  });

  it('/api/v1/test/no-ser 正确返回 且序列化为空对象', () => {
    return request(app.getHttpServer())
      .get('/v1/test/empty')
      .expect(200)
      .expect(res => {
        expect(JSON.stringify(res.body.data)).toBe('{}');
      });
  });

  it('/api/v1/test/bad-request 自定义参数异常报错', () => {
    return request(app.getHttpServer())
      .get('/v1/test/bad-request')
      .expect(200)
      .expect(res => {
        expect(res.body.errmsg === 'Bad Request!' && res.body.errcode === 400).toBeTruthy();
      });
  });

  it('/v1/test/http-exception HTTP异常', () => {
    return request(app.getHttpServer())
      .get('/v1/test/http-exception')
      .expect(200)
      .expect(res => {
        expect(res.body.errmsg === 'HTTP Exception!' && res.body.errcode === 403).toBeTruthy();
      });
  });

  it('/api/v1/test/error 普通Error', () => {
    return request(app.getHttpServer())
      .get('/v1/test/error')
      .expect(200)
      .expect(res => {
        expect(res.body.errmsg === '服务器错误' && res.body.errcode === 500).toBeTruthy();
      });
  });

  it('/api/v1/test/auth 登录拦截报错', () => {
    return request(app.getHttpServer())
      .get('/v1/test/auth')
      .expect(200)
      .expect(res => {
        expect(res.body.errmsg === '您未登录，请先登录' && res.body.errcode === 401).toBeTruthy();
      });
  });

  it('/api/v1/test/auth 登录成功', () => {
    return request(app.getHttpServer())
      .get('/v1/test/auth?name=test')
      .expect(200)
      .expect(res => {
        expect(res.body.data === 'Hello World!' && res.body.errcode === 0).toBeTruthy();
      });
  });

  it('/api/v1/test/userInfo 获取用户信息', () => {
    return request(app.getHttpServer())
      .get('/v1/test/userInfo?name=test')
      .expect(200)
      .expect(res => {
        expect(res.body.data === 'test' && res.body.errcode === 0).toBeTruthy();
      });
  });

  it('/api/v1/test/role 角色错误', () => {
    return request(app.getHttpServer())
      .get('/v1/test/role?name=test')
      .expect(200)
      .expect(res => {
        expect(res.body.errmsg === '您无权限访问该接口' && res.body.errcode === -403).toBeTruthy();
      });
  });
});
