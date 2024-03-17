import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { FindAllCollectionDto } from './find-all-collection.dto';

export class FindCollectionDto extends FindAllCollectionDto {
  @ApiProperty({
    description: 'collection id',
    example: '1',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  id: number;
}
