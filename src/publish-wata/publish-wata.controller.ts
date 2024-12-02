import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { PublishWataService } from './publish-wata.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Public } from 'src/common/decorators/public.decorator';
import { Admin } from 'src/common/decorators/admin.decorator';
import { HttpCacheInterceptor } from 'src/common/utils/httpcache.interceptor';
import {
  CACHE_TTL,
  PUBLISH_WATA_CACHEKEY,
} from 'src/common/utils/httpcache.const';
import { FilterPublishWataDto } from './dto/FilterPublishWata.dto';

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
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'publish wata 업데이트',
    description: 'publish wata 정보를 업데이트 합니다.',
  })
  @Post()
  async publishWata(@Body() filterPublishWataDto: FilterPublishWataDto) {
    await this.publishWataService.removeCache();
    return this.publishWataService.publish(filterPublishWataDto);
  }
}
