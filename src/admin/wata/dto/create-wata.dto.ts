import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNotEmpty,
  IsUrl,
  MaxLength,
  IsArray,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class PlatformWithUrlDto {
  @IsNumber()
  id: number;

  @IsString()
  // @IsUrl(null, { message: '플랫폼에는 url을 입력해야 합니다.' })
  url: string;
}

export class CreateWataDto {
  @ApiProperty({
    description: '제목',
    example: '가부장제의 창조',
    required: true,
  })
  @IsString()
  @MaxLength(250, { message: '제목은 250자까지만 입력됩니다.' })
  @IsNotEmpty({ message: '제목은 필수 입력값입니다.' })
  title: string;

  @ApiProperty({
    description: '작가/감독',
    example: '거다 러너',
    required: true,
  })
  @IsString()
  @MaxLength(20, { message: '작가/감독은 20자까지만 입력됩니다.' })
  @IsNotEmpty({ message: '작가/감독은 필수 입력값입니다.' })
  creators: string;

  @ApiProperty({
    description: '장르 id',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  genre?: number;

  @ApiProperty({
    description: '키워드 id 리스트',
    example: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  keywords?: number[];

  @ApiProperty({
    description: '주의키워드 id 리스트',
    example: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  cautions?: number[];

  @ApiProperty({
    description: '플랫폼 리스트',
    example: [
      {
        id: 1,
        url: 'http://test.com',
      },
    ],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlatformWithUrlDto)
  @IsOptional()
  platforms?: PlatformWithUrlDto[];

  @ApiProperty({
    description: '썸네일 url',
    example: 'http:test.com.jpeg',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: '썸네일은 url 값을 입력해야 합니다.' })
  thumbnail_url?: string;

  @ApiProperty({
    description: '비고',
    example: '~때문에 탈락',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}
