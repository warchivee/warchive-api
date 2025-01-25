import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class FindTranscriptionQuoteDto {
  @ApiProperty({
    description: '제목',
    example: '정치적으로 올바르지 않은 페미니스트',
  })

  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: '필사 문구 내용',
    example: '때때로 우리는 서로를 구원한다. 대다수의 여자들은 서로의 친밀한 관계 없이는 단 하루도 살아낼 수가 없었다.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: '저자',
    example: '필리스 체슬러',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  author: string;

  @ApiProperty({
    description: '옮긴이',
    example: '박경선',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  translator?: string;

  @ApiProperty({
    description: '출판사',
    example: '바다출판사',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  publisher?: string;

  @ApiProperty({
    description: '언어',
    example: 'KOREAN/ENGLISH',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  language: string;
}
