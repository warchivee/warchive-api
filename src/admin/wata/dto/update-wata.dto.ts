import { CreateWataDto } from './create-wata.dto';
import { WataLabelType } from '../interface/wata.type';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateWataDto extends PartialType(CreateWataDto) {
  @ApiProperty({
    description: '라벨',
    example: 'CHECKING',
    required: false,
    type: 'enum',
  })
  @IsEnum(WataLabelType)
  @IsOptional()
  label?: WataLabelType;
}
