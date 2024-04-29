import { Controller, Delete, Get, Post, UseInterceptors } from '@nestjs/common';
import { PublishWataService } from './publish-wata.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Public } from 'src/common/decorators/public.decorator';
import { Admin } from 'src/common/decorators/admin.decorator';
import {
  CACHE_TTL,
  HttpCacheInterceptor,
  PUBLISH_WATA_CACHEKEY,
} from 'src/admin/wata/httpcache.interceptor';

@ApiTags('Wata')
@Controller('/publish-wata')
export class PublishWataController {
  constructor(private readonly publishWataService: PublishWataService) {}

  @Public()
  @ApiOperation({
    summary: '게시 데이터 조회',
    description: '게시 데이터를 조회합니다.',
  })
  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(PUBLISH_WATA_CACHEKEY)
  @CacheTTL(CACHE_TTL)
  @Get()
  findByKeywordsByCategory() {
    return this.publishWataService.findAll();
  }

  @Admin()
  // @ApiBearerAuth('access_token')
  @Public()
  @ApiOperation({
    summary: 'publish wata 업데이트',
    description: 'publish wata 정보를 업데이트 합니다.',
  })
  @Post()
  publishWata() {
    return this.publishWataService.publish();
  }

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'publish wata 캐시 삭제',
    description: 'publish wata 캐시를 삭제합니다.',
  })
  @Delete()
  removeFindAllPublishWataCache() {
    return this.publishWataService.removeCache();
  }
}
