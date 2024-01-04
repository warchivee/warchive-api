import { IsOptional, IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class CreateWataDto {
  @MaxLength(250, { message: '제목은 250자까지만 입력됩니다.' })
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title: string;

  //todo: array로 입력받게하기
  @MaxLength(20, { message: '작가/감독은 20자까지만 입력됩니다.' })
  @IsOptional()
  creators?: string;

  @IsOptional()
  @IsUrl(null, { message: '썸네일은 url 값을 입력해야 합니다.' })
  thumbnail_url?: string;

  @IsOptional()
  note?: string;
}
