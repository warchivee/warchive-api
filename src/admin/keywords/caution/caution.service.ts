import { Inject, Injectable } from '@nestjs/common';
import { CreateCautionDto } from './dto/create-caution.dto';
import { UpdateCautionDto } from './dto/update-caution.dto';
import { Caution } from './entities/caution.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from 'src/common/exception/service.exception';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  KEYWORDS_CACHEKEY,
  KEYWORD_CACHEKEY,
} from 'src/common/utils/httpcache.const';

@Injectable()
export class CautionService {
  constructor(
    @InjectRepository(Caution)
    private readonly categoryRepository: Repository<Caution>,
    @Inject(CACHE_MANAGER) private cacheManager: any,
  ) {}
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
  create(createCautionDto: CreateCautionDto) {
    this.removeCache();
    return this.categoryRepository.save({ ...createCautionDto });
  }

  findAll() {
    return this.categoryRepository.find({
      select: {
        id: true,
        name: true,
        required: true,
      },
      order: {
        required: 'DESC',
        name: 'ASC',
      },
    });
  }

  update(id: number, updateCautionDto: UpdateCautionDto) {
    this.removeCache();
    return this.categoryRepository.save({ id, ...updateCautionDto });
  }

  remove(id: number) {
    this.removeCache();
    return this.categoryRepository.delete({ id });
  }

  async validate(ids: number[]) {
    if (!ids) return null;
    const cautions = await this.categoryRepository.find({
      where: { id: In(ids) },
    });

    if (cautions.length !== ids.length) {
      throw EntityNotFoundException('없는 주의 키워드입니다.');
    }

    return cautions;
  }
}
