import { Injectable } from '@nestjs/common';
import { TestDto } from '../dto/test.dto';

@Injectable()
export class TestService {
  test(): TestDto {
    return {
      message: 'Hello nest',
    };
  }
}
