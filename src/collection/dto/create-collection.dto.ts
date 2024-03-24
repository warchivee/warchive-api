import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCollectionDto {
  @ApiProperty({
    description: '제목',
    example: '파퍼가 좋아하는 드라마 컬렉션',
    required: true,
  })
  @IsString()
  @Matches(/[^ ]+/, { message: '제목은 필수 입력값입니다.' })
  @MaxLength(50, { message: '제목은 50자까지만 입력됩니다.' })
  @Matches(/^[\w\s가-힣ㄱ-ㅎㅏ-ㅣ\!\?\,\.\-\_\&\:\~]+$/g, {
    message: '제목은 한글,영문,숫자,특수문자(!?.,:~-_&)만 입력 가능합니다',
  })
  title: string;

  @ApiProperty({
    description: '코멘트',
    example: '제일 좋아하는 드라마를 모아봤습니다~',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: '코멘트는 200자까지만 입력됩니다.' })
  @Transform((params) => (params.value?.length > 0 ? params.value : undefined))
  @Matches(/^[\w\s가-힣ㄱ-ㅎㅏ-ㅣ\!\?\,\.\-\_\&\:\~]+$/g, {
    message: '코멘트는 한글,영문,숫자,특수문자(!?.,:~-_&)만 입력 가능합니다',
  })
  note: string;
}
