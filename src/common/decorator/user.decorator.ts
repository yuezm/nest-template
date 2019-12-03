import { createParamDecorator, SetMetadata } from '@nestjs/common';

import { IRequest } from '@App/app.interface';
import { EUserRole } from '@App/user/user.static';

export const ROLES = Symbol('ROLES');
export const AUTH_IGNORE = Symbol('AUTH_IGNORE');

/**
 * 获取用户信息的装饰器
 * 使用方式 index(@UserInfo() userInfo){...}
 */
export const UserInfo = createParamDecorator((data: any, req: IRequest) => {
  return req.userInfo;
});

/**
 * 指定接口请求的角色权限
 * 使用方式
 * @Roles(EUserRole.ALL) tips EUserRole.ALL 只允许填写一个
 * index(){...}
 */
export const Roles = (...roles: EUserRole[]) => SetMetadata(ROLES, roles);

/**
 * 指定接口无登录校验
 * 使用方式
 * @AuthIgnore()
 * index(){...}
 */
export const AuthIgnore = () => SetMetadata(AUTH_IGNORE, AUTH_IGNORE);
