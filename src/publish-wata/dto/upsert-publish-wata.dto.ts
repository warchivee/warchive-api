import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WataThumbnailCropAreaType } from 'src/admin/wata/interface/wata.type';

export class InfoDto {
  id: number;
  name: string;
}

export class PlatformInfoDto extends PartialType(InfoDto) {
  url: string;
}

export class GenreInfoDto extends PartialType(InfoDto) {
  category: {
    id: number;
    name: string;
  };
}

export class UpsertPublishWataDto {
  id: number;

  title: string;

  creators: string;

  thumbnail: string;

  thumbnail_card?: WataThumbnailCropAreaType;

  thumbnail_book?: WataThumbnailCropAreaType;

  @Type(() => GenreInfoDto)
  genre: GenreInfoDto;

  @Type(() => InfoDto)
  keywords: InfoDto[];

  @Type(() => InfoDto)
  cautions?: InfoDto[];

  @Type(() => PlatformInfoDto)
  platforms: PlatformInfoDto[];

  adder?: InfoDto;

  updater?: InfoDto;
}
