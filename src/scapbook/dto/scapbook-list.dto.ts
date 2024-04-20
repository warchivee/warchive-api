import { Scrapbook } from '../entities/scapbook.entity';

export class ScrapbookListResponseDto {
  id: number;
  title: string;
  note: string;
  shared_id: string;
  created_at: Date;
  updated_at: Date;

  static of(
    scrapbook: Scrapbook,
    encryptedText: string,
  ): ScrapbookListResponseDto {
    return {
      id: scrapbook.id,
      title: scrapbook.title,
      note: scrapbook.note,
      shared_id: encryptedText,
      created_at: scrapbook.created_at,
      updated_at: scrapbook.updated_at,
    };
  }
}
