import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class DeleteScrapbookItemsDto {
  @ApiProperty({
    description: '스크랩북 아이템 삭제 리스트',
    required: true,
  })
  @IsNumber({}, { each: true })
  @IsArray()
  delete_ids: number[];
}
