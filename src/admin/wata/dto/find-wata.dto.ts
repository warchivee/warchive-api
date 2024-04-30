import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { WataLabelType, WataRequiredValuesType } from '../interface/wata.type';
import {
  QueryValidEnumArray,
  QueryValidNumberArray,
} from 'src/common/decorators/dto.decorator';
// docs - query number[] issue : https://dev.to/avantar/validating-numeric-query-parameters-in-nestjs-gk9

export class FindWataDto {
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

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  title?: string;

  @ApiProperty({
    maximum: 100,
    required: false,
  })
  @IsOptional()
  creators?: string;

  @QueryValidEnumArray(WataLabelType)
  @IsOptional()
  label?: WataLabelType[];

  @QueryValidNumberArray()
  @IsOptional()
  categories?: number[];

  @QueryValidNumberArray()
  @IsOptional()
  genres?: number[];

  @QueryValidNumberArray()
  @IsOptional()
  keywords?: number[];

  @QueryValidNumberArray()
  @IsOptional()
  cautions?: number[];

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
  updateStartDate?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  updateEndDate?: Date;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsBoolean()
  @Transform(({ obj, key }) => {
    // query string 은 전부 string 으로 넘어와서 transform 해줘야함.
    // @IsBoolean 을 사용하면 값이 있으면 true 없으면 false로 넘어와서 아래처럼 작성해줘야함
    return obj[key] == 'true' ? true : false;
  })
  @IsOptional()
  isPublished?: boolean;

  @QueryValidEnumArray(WataRequiredValuesType)
  @IsOptional()
  needWriteItems?: WataRequiredValuesType[];
}
