import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class CreateReactionDto {
  @ApiProperty({
    description: 'Book ID',
    example: 202406,
    required: true,
  })
  @IsNumber()
  book_id: number;

  @ApiProperty({
    description: 'Review ID',
    example: '3',
    required: true,
  })
  @IsNumber()
  review_id: number;

  @ApiProperty({
    description: 'UUID',
    example: 'asdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  uuid?: string;

  @ApiProperty({
    description: 'is_best',
    example: 'false',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_best?: boolean;

  @ApiProperty({
    description: 'is_funny',
    example: 'false',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_funny?: boolean;

  @ApiProperty({
    description: 'is_interested',
    example: 'false',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_interested?: boolean;

  @ApiProperty({
    description: 'is_empathized',
    example: 'false',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_empathized?: boolean;

  @ApiProperty({
    description: 'is_amazed',
    example: 'false',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_amazed?: boolean;

  @IsOptional()
  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  updated_at?: Date;
}
