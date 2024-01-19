import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { WataLabelType } from '../interface/wata.type';
import {
  QueryValidEnumArray,
  QueryValidNumberArray,
} from '../../../common/decorators/dto.decorator';

// docs - query number[] issue : https://dev.to/avantar/validating-numeric-query-parameters-in-nestjs-gk9

export class FindWataDto {
  // page
  @ApiProperty({
    default: 1,
    required: false,
    type: Number,
  })
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page?: number;

  // page size
  @ApiProperty({
    default: 10,
    required: false,
    type: Number,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page_size?: number;

  // title
  @ApiProperty({
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
  @QueryValidEnumArray(WataLabelType)
  @IsOptional()
  label?: WataLabelType[];

  // category
  @QueryValidNumberArray()
  @IsOptional()
  categories?: number[];

  // genre
  @QueryValidNumberArray()
  @IsOptional()
  genres?: number[];

  // keyword
  @QueryValidNumberArray()
  @IsOptional()
  keywords?: number[];

  //caution
  @QueryValidNumberArray()
  @IsOptional()
  cautions?: number[];

  // platform
  @QueryValidNumberArray()
  @IsOptional()
  platforms?: number[];

  @ApiProperty({
    required: false,
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  updateStartDate: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  updateEndDate: Date;
}
