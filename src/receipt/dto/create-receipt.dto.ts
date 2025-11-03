import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateReceiptDto {
  @ApiProperty({
    description: '날짜',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: '카테고리',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: '제목',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: '평점',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  rating?: string;
}
