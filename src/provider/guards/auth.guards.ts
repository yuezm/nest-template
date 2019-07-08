import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuards implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { headers, cookies, query, body } = context.switchToHttp().getRequest<Request>();
    const token = headers.token || cookies.token || query.token || body.token;
    // --------------- 自定义拦截规则 ---------------
    if (!token) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
