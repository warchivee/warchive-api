import { Inject, Injectable } from '@nestjs/common';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { Keyword } from './entities/keyword.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from 'src/common/exception/service.exception';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  KEYWORDS_CACHEKEY,
  KEYWORD_CACHEKEY,
} from 'src/admin/wata/httpcache.interceptor';

@Injectable()
export class KeywordService {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
    @Inject(CACHE_MANAGER) private cacheManager: any,
  ) {}

  // 지정된 캐시키로 시작되는 캐시 데이터들 삭제
  async removeCache() {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (
        key.startsWith(KEYWORD_CACHEKEY) ||
        key.startsWith(KEYWORDS_CACHEKEY)
      ) {
        this.cacheManager.del(key);
      }
    });
  }

  create(createKeywordDto: CreateKeywordDto) {
    this.removeCache(); // 캐시 삭제
    return this.keywordRepository.save({ ...createKeywordDto });
  }

  findAll() {
    return this.keywordRepository.find();
  }

  update(id: number, updateKeywordDto: UpdateKeywordDto) {
    this.removeCache(); // 캐시 삭제
    return this.keywordRepository.save({ id, ...updateKeywordDto });
  }

  remove(id: number) {
    this.removeCache(); // 캐시 삭제
    return this.keywordRepository.delete({ id });
  }

  async validate(ids: number[]) {
    if (!ids) return null;
    const keywords = await this.keywordRepository.find({
      where: { id: In(ids) },
    });

    if (keywords.length !== ids.length) {
      throw EntityNotFoundException('없는 키워드입니다.');
    }

    return keywords;
  }
}
