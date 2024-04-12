import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';

export class InfoDto {
  @ApiProperty({
    description: 'ID',
    example: '1',
    required: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '정보명',
    example: '카테고리/장르/키워드/주의/플랫폼',
  })
  @IsString()
  name: string;
}

export class PlatformInfoDto extends PartialType(InfoDto) {
  @ApiProperty({
    description: '플랫폼 주소',
    example: 'https://store.steampowered.com/app/794540/Neo_Cab/',
  })
  @IsString()
  url: string;
}

export class SavePublishWataDto {
  @ApiProperty({
    description: '와타 ID',
    example: '1',
    required: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '제목',
    example: 'Neo Cab',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '감독',
    example: 'creators',
  })
  @IsString()
  creators: string;

  @ApiProperty({
    description: '카드 썸네일 url',
    example: 'https://i.ibb.co/jWy32Jc/Neo-Cab-card.jpg',
  })
  @IsString()
  thumbnail_card: string;

  @ApiProperty({
    description: '책 썸네일 url',
    example: 'https://i.ibb.co/zQFyQ86/Neo-Cab-book.jpg',
  })
  @IsString()
  thumbnail_book: string;

  @ApiProperty({
    description: '카테고리 정보',
    type: [InfoDto],
  })
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => InfoDto)
  category: InfoDto[];

  @ApiProperty({
    description: '장르 정보',
    type: [InfoDto],
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => InfoDto)
  genre: InfoDto[];

  @ApiProperty({
    description: '키워드 정보',
    type: [InfoDto],
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => InfoDto)
  keywords: InfoDto[];

  @ApiProperty({
    description: '주의 정보',
    type: [InfoDto],
  })
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => InfoDto)
  cautions: InfoDto[];

  @ApiProperty({
    description: '플랫폼 정보',
    type: [PlatformInfoDto],
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => PlatformInfoDto)
  platforms: PlatformInfoDto[];
}

export class SavePublishWataDtoList {
  @ApiProperty({
    description: 'list of publishWata',
    type: [SavePublishWataDto], // List 로 받을 객체의 타입을 선언해준다.
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SavePublishWataDto)
  data: SavePublishWataDto[];
}
