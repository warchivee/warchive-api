import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class FindFavoriteDto {
  @ApiProperty({
    description: '필사 문구 내용',
    example: '서두를 필요가 없습니다. 재치를 번뜩일 필요도 없지요.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: '작성자 이름',
    example: '버지니아 울프',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  author?: string;
}