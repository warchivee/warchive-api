export enum WataLabelType {
  NEED_CHECK = 'NEED_CHECK',
  CHECKING = 'CHECKING',
  CHECKED = 'CHECKED',
  HOLD = 'HOLD',
  NEED_CONTACT = 'NEED_CONTACT',
  CENSOR = 'CENSOR',
}

export enum WataRequiredValuesType {
  TITLE = 'title',
  CREATORS = 'creator',
  GENRE = 'genre',
  KEYWORDS = 'keywords',
  PLATFORMS = 'platforms',
  THUMBNAIL = 'thumbnail',
}

interface WataRequiredValuesColumnInfoType {
  name: string;
  type: 'string' | 'fk' | 'mapping-many';
  mappingColumnName?: string;
}

export interface WataThumbnailCropAreaType {
  w: number;
  h: number;
  x: number;
  y: number;
}

export const WataRequiredValuesColumnInfo: Record<
  WataRequiredValuesType,
  WataRequiredValuesColumnInfoType
> = {
  title: {
    name: 'title',
    type: 'string',
  },
  creator: {
    name: 'creators',
    type: 'string',
  },
  genre: {
    name: 'genre',
    type: 'fk',
  },
  thumbnail: {
    name: 'thumbnail',
    type: 'string',
  },
  keywords: {
    name: 'keywords',
    type: 'mapping-many',
    mappingColumnName: 'keyword',
  },
  platforms: {
    name: 'platforms',
    type: 'mapping-many',
    mappingColumnName: 'platform',
  },
};
