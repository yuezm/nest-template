import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {

  test(): string {
    return 'Hello World!';
  }
}
