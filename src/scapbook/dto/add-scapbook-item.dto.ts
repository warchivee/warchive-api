import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class AddScrapbookItemListDto {
  @ApiProperty({
    description: '스크랩북 아이템 추가 리스트',
    required: true,
  })
  @IsNumber({}, { each: true })
  @IsArray()
  add_ids: number[];
}
