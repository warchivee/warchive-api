import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({
    description: '제목',
    example: '파퍼가 좋아하는 드라마 컬렉션',
    required: true,
  })
  @IsString()
  @MaxLength(50, { message: '제목은 50자까지만 입력됩니다.' })
  @IsNotEmpty({ message: '제목은 필수 입력값입니다.' })
  title: string;

  @ApiProperty({
    description: '코멘트',
    example: '제일 좋아하는 드라마를 모아봤습니다~',
    required: false,
  })
  @IsString()
  @MaxLength(200, { message: '코멘트는 200자까지만 입력됩니다.' })
  @IsOptional()
  note: string;
}
