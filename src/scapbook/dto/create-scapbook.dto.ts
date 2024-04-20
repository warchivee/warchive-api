import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  Matches,
  IsNotEmpty,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  COLLECTION_COMMENT_LIMIT_LENGTH,
  COLLECTION_TITLE_LIMIT_LENGTH,
} from 'src/common/utils/scrapbook.const';
import { IsNotUrl } from 'src/common/utils/custom-valid';

export class CreateScrapbookDto {
  @ApiProperty({
    description: '제목',
    example: '파퍼가 좋아하는 드라마 스크랩북',
    required: true,
  })
  @IsString()
  @Matches(/[^ ]+/, { message: '제목은 필수 입력값입니다.' })
  @MaxLength(COLLECTION_TITLE_LIMIT_LENGTH, {
    message: `제목은 ${COLLECTION_TITLE_LIMIT_LENGTH}자까지만 입력됩니다.`,
  })
  @Validate(IsNotUrl, {
    message: '제목에는 url을 입력할 수 없습니다.',
  })
  @IsNotEmpty()
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
  @Validate(IsNotUrl, {
    message: '코멘트에는 url을 입력할 수 없습니다.',
  })
  note: string;
}
