import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCollectionDto {
  @ApiProperty({
    description: '제목',
    example: '컬렉션 제목',
    required: true,
  })
  @IsString()
  @MaxLength(50, { message: '제목은 50자까지만 입력됩니다.' })
  @IsNotEmpty({ message: '제목은 필수 입력값입니다.' })
  title: string;
}
