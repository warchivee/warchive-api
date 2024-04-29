import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WataThumbnailCropAreaType } from 'src/admin/wata/interface/wata.type';

export class KeywordType {
  id: number;
  name: string;
}

export class CautionType extends PartialType(KeywordType) {
  required: boolean;
}

export class PlatformType extends PartialType(KeywordType) {
  url: string;
  order_top: boolean;
}

export class GenreType extends PartialType(KeywordType) {
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
  genre: GenreType;

  @Type(() => KeywordType)
  keywords: KeywordType[];

  @Type(() => CautionType)
  cautions?: CautionType[];

  @Type(() => PlatformType)
  platforms: PlatformType[];

  adder?: KeywordType;
  updater?: KeywordType;
}
