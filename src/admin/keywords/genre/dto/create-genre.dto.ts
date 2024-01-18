import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({
    description: '장르명',
    example: '영화',
  })
  @MaxLength(12)
  @IsString()
  name: string;
}
