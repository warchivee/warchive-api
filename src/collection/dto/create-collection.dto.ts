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
  @MaxLength(20, { message: '제목은 20자까지만 입력됩니다.' })
  @Matches(
    /^(?![\s\S]*\<|\>|\&|\[|\]|\(|\)|\{|\}|\|\'|\"|\bon(load|click|mouseover|...)\s*=|javascript:)/gi,
    {
      message:
        '컬렉션 이름에는 괄호, &, 따옴표, 외부 주소를 입력할 수 없습니다.',
    },
  )
  title: string;

  @ApiProperty({
    description: '코멘트',
    example: '제일 좋아하는 드라마를 모아봤습니다~',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(COLLECTION_COMMENT_LIMIT_LENGTH, {
    message: `코멘트는 ${COLLECTION_COMMENT_LIMIT_LENGTH}자까지만 입력됩니다.`,
  })
  @Transform((params) => (params.value?.length > 0 ? params.value : null))
  @Matches(
    /^(?![\s\S]*\<|\>|\&|\[|\]|\(|\)|\{|\}|\|\'|\"|\bon(load|click|mouseover|...)\s*=|javascript:)/gi,
    {
      message: '코멘트에는 괄호, &, 따옴표, 외부 주소를 입력할 수 없습니다.',
    },
  )
  note: string;
}
