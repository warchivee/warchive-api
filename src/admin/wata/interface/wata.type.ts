export enum WataLabelType {
  NEED_CHECK = 'NEED_CHECK',
  CHECKING = 'CHECKING',
  CHECKED = 'CHECKED',
  HOLD = 'HOLD',
  NEED_CANTACT = 'NEED_CANTACT',
  CENSOR = 'CENSOR',
}

export enum WataRequiredValuesType {
  TITLE = 'title',
  CREATORS = 'creator',
  GENRE = 'genre',
  KEYWORDS = 'keywords',
  PLATFORMS = 'platforms',
  THUMBNAIL_CARD = 'thumbnailCard',
  THUMBNAIL_BOOK = 'thumbnailBook',
}

interface WataRequiredValuesColumnInfoType {
  name: string;
  type: 'string' | 'fk' | 'mapping-many';
  mappingColumnName?: string;
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
  thumbnailCard: {
    name: 'thumbnail_card',
    type: 'string',
  },
  thumbnailBook: {
    name: 'thumbnail_book',
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
