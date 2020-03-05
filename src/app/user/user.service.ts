import { Injectable } from '@nestjs/common';
import { Log } from '@Common/decorator/common.decorator';
import { IRequest } from '@App/app.interface';

@Injectable()
export class UserService {
  @Log()
  checkLogin(): boolean {
    return true;
  }

  @Log()
  testUser(req: IRequest, query: boolean): string {
    if (query) {
      return 'hello，nest';
    }
    return 'hello，word';
  }
}
