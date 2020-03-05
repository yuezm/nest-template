import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { UserService } from '@App/user/user.service';
import { IRequest } from '@App/app.interface';
import { ResponseSerialize } from '@Common/decorator/transform.decorator';
import { UserDto } from './user.dto';

@Controller('v1/user')
@ApiUseTags('user: 用户模块')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ResponseSerialize(UserDto)
  @ApiOperation({ title: '' })
  testUser(@Req() req: IRequest): string {
    return this.userService.testUser(req, true);
  }
}
