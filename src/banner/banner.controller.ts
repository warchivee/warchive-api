import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { BannerService } from './banner.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { BANNER_CACHEKEY, CACHE_TTL } from 'src/common/utils/httpcache.const';

@ApiTags('banner')
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheKey(BANNER_CACHEKEY)
  @CacheTTL(CACHE_TTL)
  @Get()
  findPosted() {
    return this.bannerService.findPosted();
  }

  @Post('cache/clear')
  clearCache() {
    return this.bannerService.clearCache();
  }
}
