import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreatePlatformDto {
  @ApiProperty({ description: '키워드명', example: '성장' })
  @MaxLength(12)
  @IsString()
  name: string;
}
