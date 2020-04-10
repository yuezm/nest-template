import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from '@App/user/user.service';

@Controller('v1/user')
@ApiTags('user: 用户模块')
export class UserController {
  constructor(private readonly userService: UserService) {
    //
  }
}
