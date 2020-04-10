import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserService } from '@App/user/user.service';
import { AUTH_IGNORE } from '@Common/decorator/user.decorator';
import { IRequest } from '@App/app.interface';

@Injectable()
export class AuthGuards implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 跳过登录校验
    if (this.reflector.get(AUTH_IGNORE, context.getHandler()) === AUTH_IGNORE) {
      return true;
    }

    const request: IRequest = context.switchToHttp().getRequest<IRequest>();
    // 登录校验
    if (!this.userService.checkLogin(request.query.name)) {
      throw new UnauthorizedException('您未登录，请先登录');
    }

    request.userInfo = {
      // 用户信息
    };

    return true;
  }
}
