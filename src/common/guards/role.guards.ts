import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { ROLES } from '@Common/decorator/user.decorator';
import { IRequest } from '@App/app.interface';

@Injectable()
export class RoleGuards implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles: number[] = this.reflector.get<number[]>(ROLES, context.getHandler());
    const request = context.switchToHttp().getRequest<IRequest>();

    if (!roles.includes(request.userInfo.role)) {
      throw new HttpException('您无权限访问该接口', -403);
    }

    return true;
  }
}
