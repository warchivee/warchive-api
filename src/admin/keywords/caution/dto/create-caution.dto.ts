import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateCautionDto {
  @ApiProperty({ description: '주의키워드명', example: '남감독' })
  @MaxLength(12)
  @IsString()
  name: string;
}
