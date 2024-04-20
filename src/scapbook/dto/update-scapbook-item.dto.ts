import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({
    description: 'wata id',
    required: true,
    type: Number,
  })
  @IsNumber()
  wata_id: number;

  @ApiProperty({
    description: '액션',
    required: true,
  })
  @IsString()
  action: 'ADD' | 'DELETE';

  @ApiProperty({
    description: '컬렉션 아이디',
    required: true,
    type: Number,
  })
  @IsNumber()
  scrapbook_id: number;
}
