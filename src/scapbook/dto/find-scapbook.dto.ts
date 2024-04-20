import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { FindAllScrapbookDto } from './find-all-scapbook.dto';

export class FindScrapbookDto extends FindAllScrapbookDto {
  @ApiProperty({
    description: '암호화된 scrapbook id = shared_id',
    example: 'asdfdsf==',
    required: true,
  })
  @IsString()
  @Type(() => String)
  id: string;
}
