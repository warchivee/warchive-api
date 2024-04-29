import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePlatformDto {
  @ApiProperty({ description: '키워드명', example: '성장' })
  @MaxLength(12)
  @IsString()
  name: string;

  @ApiProperty({ description: '상위 노출 여부', example: 'true' })
  @IsOptional()
  @IsBoolean()
  order_top?: boolean;

  @ApiProperty({ description: 'url 도메인', example: 'youtube' })
  @IsString()
  domain?: string;
}
