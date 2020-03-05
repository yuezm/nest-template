import { Expose } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiModelProperty({ description: '' })
  @Expose()
  name: string;
}
