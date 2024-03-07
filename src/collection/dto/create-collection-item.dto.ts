import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class CreateCollectionItemDto {
  @ApiProperty({
    description: '컬렉션 ID',
    example: '1',
    required: true,
    type: [Number],
  })
  @IsNumber()
  collection_id: number;

  @ApiProperty({
    description: '와타 ID',
    example: '1',
    required: true,
  })
  @IsNumber()
  wata_id: number;
}

export class CreateCollectionItemListDto {
  @ApiProperty({
    description: 'list of test',
    type: [CreateCollectionItemDto],
  })
  @IsArray()
  @Type(() => CreateCollectionItemDto)
  data: CreateCollectionItemDto[];
}
