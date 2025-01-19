import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserQuoteRecordDto {
  @ApiProperty({ description: '문구 ID', example: 42 })
  @IsNotEmpty()
  @IsInt()
  quoteId: number;
}
