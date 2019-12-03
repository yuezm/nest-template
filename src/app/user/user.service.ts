import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  checkLogin() {
    return true;
  }
}
