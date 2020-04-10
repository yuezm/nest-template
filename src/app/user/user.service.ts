import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  checkLogin(name?: string): boolean {
    return name === 'test';
  }
}
