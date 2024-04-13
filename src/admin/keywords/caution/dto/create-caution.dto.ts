import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCautionDto {
  @ApiProperty({ description: '주의키워드명', example: '남감독' })
  @MaxLength(12)
  @IsString()
  name: string;

  @ApiProperty({ description: '필수 입력 요소', example: 'true' })
  @IsOptional()
  @IsBoolean()
  required?: boolean;
}
