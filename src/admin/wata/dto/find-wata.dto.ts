import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

export class FindWataDto {
  // page
  @ApiProperty({
    default: 1,
    required: false,
  })
  @IsOptional()
  page?: number;

  // title
  @ApiProperty({
    maximum: 250,
    required: false,
  })
  @MaxLength(250, { message: '제목은 250자까지만 입력됩니다.' })
  @IsOptional()
  title?: string;

  // creators
  @ApiProperty({
    maximum: 20,
    required: false,
  })
  @MaxLength(20, { message: '작가/감독은 20자까지만 입력됩니다.' })
  @IsOptional()
  creators?: string;

  // label
  @ApiProperty({
    // maximum: 20,
    enum: [
      'NEED_CHECK',
      'CHECKING',
      'CHECKED',
      'HOLD',
      'NEED_CANTACT',
      'CENSOR',
    ],
    isArray: true,
    required: false,
  })
  @IsOptional()
  label?: number[];

  // category
  @ApiProperty({
    isArray: true,
    required: false,
  })
  @IsOptional()
  categories?: number[];

  // genre
  @ApiProperty({
    isArray: true,
    required: false,
  })
  @IsOptional()
  genres?: number[];

  // keyword
  @ApiProperty({
    isArray: true,
    required: false,
  })
  @IsOptional()
  keywords?: number[];

  //caution
  @ApiProperty({
    isArray: true,
    required: false,
  })
  @IsOptional()
  cautions?: number[];

  // platform
  @ApiProperty({
    isArray: true,
    required: false,
  })
  @IsOptional()
  platforms?: number[];
}
