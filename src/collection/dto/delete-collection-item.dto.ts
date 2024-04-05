import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class DeleteCollectionItemsDto {
  @ApiProperty({
    description: '컬랙션 아이템 삭제 리스트',
    required: true,
  })
  @IsNumber({}, { each: true })
  @IsArray()
  delete_ids: number[];
}
