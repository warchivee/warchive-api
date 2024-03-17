import { Collection } from '../entities/collection.entity';

export class CollectionListResponseDto {
  id: number;
  title: string;
  note: string;
  shared_id: string;
  created_at: Date;
  updated_at: Date;

  static of(
    collection: Collection,
    encryptedText: string,
  ): CollectionListResponseDto {
    return {
      id: collection.id,
      title: collection.title,
      note: collection.note,
      shared_id: encryptedText,
      created_at: collection.created_at,
      updated_at: collection.updated_at,
    };
  }
}
