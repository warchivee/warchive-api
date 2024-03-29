import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class DeleteCollectionItemDto {
  @ApiProperty({
    description: '컬렉션 아이템 ID',
    example: '1',
    required: true,
  })
  @IsNumber()
  wata_id: number;
}

export class DeleteCollectionItemsDto {
  @ApiProperty({
    description: '컬랙션 아이템 삭제 리스트',
    type: [DeleteCollectionItemDto],
    required: true,
  })
  @IsArray()
  @Type(() => DeleteCollectionItemDto)
  data: DeleteCollectionItemDto[];
}
