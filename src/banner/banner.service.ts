import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BANNER_CACHEKEY } from 'src/common/utils/httpcache.const';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,

    @Inject(CACHE_MANAGER) private cacheManager: any,
  ) {}

  findPosted() {
    return this.bannerRepository.find({ where: { status: 'POSTED' } });
  }

  async clearCache() {
    await this.cacheManager.del(BANNER_CACHEKEY);
  }
}
