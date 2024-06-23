import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class FilterPublishWataDto {
  @ApiProperty({
    description: '제목',
    example: ['작품명1', '작품명2'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  titles?: string[];
}
