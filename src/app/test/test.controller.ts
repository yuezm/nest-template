import { BadRequestException, Controller, Get, HttpException, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { TestService } from './test.service';
import { ResponseSerialize } from '@Common/decorator/transform.decorator';
import { TestReqDto, TestResDto } from '@App/test/test.dto';
import { EmptyDto } from '@App/app.dto';
import { AuthIgnore } from '@Common/decorator/user.decorator';

@Controller('/v1/test')
@ApiTags('test: 测试')
export class TestController {
  constructor(private readonly testService: TestService) {
  }

  @Get('/')
  @AuthIgnore()
  @ResponseSerialize(TestResDto, true)
  @ApiOperation({ summary: 'ValidatePipe-BadRequest' })
  testParamsValidate(@Query() query: TestReqDto): string {
    console.log(query);
    return this.testService.test();
  }

  @Get('/no-ser')
  @AuthIgnore()
  @ApiOperation({ summary: '不序列化返回值' })
  testNotResponseSerialize(): string {
    return this.testService.test();
  }

  @Get('/empty')
  @AuthIgnore()
  @ResponseSerialize(EmptyDto, true)
  @ApiOperation({ summary: '不序列化返回值' })
  testEmptyRes(): string {
    return this.testService.test();
  }

  @Get('/bad-request')
  @AuthIgnore()
  @ResponseSerialize(EmptyDto, true)
  @ApiOperation({ summary: '自定义BadRequest' })
  testBadRequest(): string {
    throw new BadRequestException('Bad Request!');
  }

  @Get('/http-exception')
  @AuthIgnore()
  @ResponseSerialize(EmptyDto, true)
  @ApiOperation({ summary: 'HTTP异常测试' })
  testHTTPException(): string {
    throw new HttpException('HTTP Exception!', 403);
  }

  @Get('/error')
  @AuthIgnore()
  @ResponseSerialize(EmptyDto, true)
  @ApiOperation({ summary: 'HTTP异常测试' })
  testError(): string {
    throw new Error('Error!');
  }

  @Get('/auth')
  @ResponseSerialize(TestResDto, true)
  @ApiOperation({ summary: '登录拦截测试' })
  testAuthError(): string {
    return this.testService.test();
  }
}
