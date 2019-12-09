import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  checkLogin(): boolean {
    return true;
  }
}
