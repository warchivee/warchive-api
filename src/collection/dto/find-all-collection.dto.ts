import { ApiProperty } from '@nestjs/swagger';
import { Min, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllCollectionDto {
  // paginaton
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
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page_size?: number;

  getSkip() {
    return (this.page - 1) * this.page_size;
  }

  getTake() {
    return this.page_size;
  }
}
