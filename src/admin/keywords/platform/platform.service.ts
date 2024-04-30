import { Inject, Injectable } from '@nestjs/common';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Platform } from './entities/platform.entity';
import { In, Repository } from 'typeorm';
import { EntityNotFoundException } from 'src/common/exception/service.exception';
import { PlatformWithUrlDto } from 'src/admin/wata/dto/create-wata.dto';
import {
  KEYWORDS_CACHEKEY,
  KEYWORD_CACHEKEY,
} from 'src/common/utils/httpcache.const';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(Platform)
    private readonly platformRepository: Repository<Platform>,
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

  create(createPlatformDto: CreatePlatformDto) {
    this.removeCache();
    return this.platformRepository.save({ ...createPlatformDto });
  }

  findAll() {
    return this.platformRepository.find({
      select: {
        id: true,
        name: true,
        domain: true,
        order_top: true,
      },
      order: {
        order_top: 'DESC',
        name: 'ASC',
      },
    });
  }

  update(id: number, updatePlatformDto: UpdatePlatformDto) {
    this.removeCache();
    return this.platformRepository.save({ id, ...updatePlatformDto });
  }

  remove(id: number) {
    this.removeCache();
    return this.platformRepository.delete({ id });
  }

  async validate(platformWithUrlDto: PlatformWithUrlDto[]) {
    if (!platformWithUrlDto) return null;

    const platforms = await this.platformRepository.find({
      where: { id: In(platformWithUrlDto.map((item) => item.id)) },
    });

    if (platforms.length !== platformWithUrlDto.length) {
      throw EntityNotFoundException('없는 플랫폼입니다.');
    }

    return platformWithUrlDto;
  }
}
