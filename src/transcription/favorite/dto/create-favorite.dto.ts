import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({ description: '문구 ID', example: 42 })
  @IsNotEmpty()
  @IsInt()
  quoteId: number;
}
