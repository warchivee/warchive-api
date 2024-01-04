import {
  IsOptional,
  IsNotEmpty,
  IsUrl,
  MaxLength,
  IsArray,
} from 'class-validator';

class PlatformDto {
  id: number;

  @IsUrl(null, { message: '플랫폼에는 url을 입력해야 합니다.' })
  url: string;
}

export class CreateWataDto {
  @MaxLength(250, { message: '제목은 250자까지만 입력됩니다.' })
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title: string;

  @IsOptional()
  genre?: number;

  //todo: array로 입력받게하기
  @MaxLength(20, { message: '작가/감독은 20자까지만 입력됩니다.' })
  @IsOptional()
  creators?: string;

  @IsOptional()
  @IsArray()
  keywords?: number[];

  @IsOptional()
  @IsArray()
  cautions?: number[];

  @IsOptional()
  @IsArray()
  platforms?: PlatformDto[];

  @IsOptional()
  @IsUrl(null, { message: '썸네일은 url 값을 입력해야 합니다.' })
  thumbnail_url?: string;

  @IsOptional()
  note?: string;
}
