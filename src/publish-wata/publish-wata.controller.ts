import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { PublishWataService } from './publish-wata.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  CACHE_TTL,
  HttpCacheInterceptor,
  PUBLISH_WATA_CACHEKEY,
} from 'src/admin/wata/httpcache.interceptor';
import { Public } from 'src/common/decorators/public.decorator';

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
  @CacheKey(PUBLISH_WATA_CACHEKEY) //todo: publish 작업 시 캐시 초기화.
  @CacheTTL(CACHE_TTL)
  @Get()
  findByKeywordsByCategory() {
    return this.publishWataService.findAll();
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'publish wata 정보 수정',
    description: 'publish wata 정보를 업데이트 합니다.',
  })
  @Post()
  publishWata(@Request() req, @Body() publishWatas: SavePublishWataDto[]) {
    return this.publishWataService.puslish(req.user, publishWatas);
  }
}
