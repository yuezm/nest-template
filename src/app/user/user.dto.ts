import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EUserRole } from '@App/user/user.static';

export class UserDto {
  @ApiPropertyOptional({ description: '名称', enum: EUserRole })
  @Expose()
  name: string;
}

export class UserCSRFTokenDto {
  @ApiProperty()
  @Expose()
  token: string;
}
