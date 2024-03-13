import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class AddCollectionItemDto {
  @ApiProperty({
    description: '컬렉션 ID',
    example: '1',
    required: true,
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

export class AddCollectionItemListDto {
  @ApiProperty({
    description: '컬랙션 아이템 추가 리스트',
    type: [AddCollectionItemDto],
    required: true,
  })
  @IsArray()
  @Type(() => AddCollectionItemDto)
  data: AddCollectionItemDto[];
}
