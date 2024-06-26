import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/admin.decorator';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { HttpCacheInterceptor } from '../../common/utils/httpcache.interceptor';
import { CACHE_TTL, KEYWORDS_CACHEKEY } from 'src/common/utils/httpcache.const';

@ApiTags('Keywords')
@Controller('admin/keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '카테고리 및 하위 장르, 키워드, 주의키워드, 플랫폼 목록 전체 조회',
    description:
      '카테고리 및 하위 장르, 키워드, 주의키워드, 플랫폼 전체 목록을 조회합니다. 키워드 선택 드롭다운, 키워드 목록 조회 등에 사용됩니다.',
  })
  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(KEYWORDS_CACHEKEY)
  @CacheTTL(CACHE_TTL)
  @Get()
  findAll() {
    return this.keywordsService.findAll();
  }
}
