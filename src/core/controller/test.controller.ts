import { Controller, Get } from '@nestjs/common';
import { TestService } from '../service/test.service';
import { TestDto } from '../dto/test.dto';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {
  }

  @Get()
  index(): TestDto {
    return this.testService.test();
  }
}
