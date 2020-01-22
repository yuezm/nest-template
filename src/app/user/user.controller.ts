import { Controller, Get } from '@nestjs/common';
import { UserService } from '@App/user/user.service';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('/')
  test(): boolean {
    return this.userService.checkLogin();
  }
}
