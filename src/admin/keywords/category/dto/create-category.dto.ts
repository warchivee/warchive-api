import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: '카테고리명', example: '영상' })
  @MaxLength(12)
  @IsString()
  name: string;
}
