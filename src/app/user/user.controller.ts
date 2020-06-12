import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { UserService } from '@App/user/user.service';
import { ResponseSerialize } from '@Common/decorator/transform.decorator';
import { UserCSRFTokenDto } from '@App/user/user.dto';

@Controller('v1/user')
@ApiTags('user: 用户模块')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('/csrf')
  @ResponseSerialize(UserCSRFTokenDto)
  @ApiOperation({ summary: '获取CSRF Token' })
  ShowCSRFToken(@Req() req: Request): string {
    return req.csrfToken();
  }

  @Get('/test')
  @ApiOperation({ summary: 'Test' })
  ShowCSRFTokenPost(): string {
    return 'Hello, Test!!!';
  }
}
