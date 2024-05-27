import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class FilterPublishWataDto {
  @ApiProperty({
    description: '제목',
    example: '가부장제의 창조',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  titles?: string[];
}
