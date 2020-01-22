import { Injectable } from '@nestjs/common';
import { Logger } from '@Common/decorator/util.decorator';

@Injectable()
export class UserService {

  onModuleInit() {
    console.log(Reflect.getMetadata('checkLogin', this));
  }

  @Logger()
  checkLogin(): boolean {
    return true;
  }
}
