import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { FindAllCollectionDto } from './find-all-collection.dto';

export class FindCollectionDto extends FindAllCollectionDto {
  @ApiProperty({
    description: '암호화된 collection id = shared_id',
    example: 'asdfdsf==',
    required: true,
  })
  @IsString()
  @Type(() => String)
  id: string;
}
