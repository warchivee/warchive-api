import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class AddCollectionItemListDto {
  @ApiProperty({
    description: '컬랙션 아이템 추가 리스트',
    required: true,
  })
  @IsNumber({}, { each: true })
  @IsArray()
  add_ids: number[];
}
