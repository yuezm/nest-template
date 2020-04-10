import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TestReqDto {
  @ApiProperty()
  @IsInt({ message: 'ID 必须为整数' })
  @Type(() => Number)
  id: number;
}

export class TestResDto {
}
