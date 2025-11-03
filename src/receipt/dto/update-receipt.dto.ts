import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateReceiptDto } from './create-receipt.dto';

export class UpdateReceiptDto extends CreateReceiptDto {
  @ApiProperty({
    description: '영수증 데이터 id',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({
    description: '동작',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  action?: string;
}
