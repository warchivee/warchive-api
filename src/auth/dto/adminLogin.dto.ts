import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ description: '계정' })
  @IsString()
  account: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  password: string;
}
