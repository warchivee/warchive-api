import { IsOptional, IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class CreateWataDto {
  @MaxLength(250)
  @IsNotEmpty()
  title: string;

  @MaxLength(20)
  @IsOptional()
  creators?: string;

  @IsOptional()
  @IsUrl()
  thumbnail_url?: string;

  @IsOptional()
  note?: string;
}
