import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  HttpCacheInterceptor,
  KEYWORD_CACHEKEY,
  CACHE_TTL,
} from 'src/admin/wata/httpcache.interceptor';
import { Admin } from 'src/common/decorators/admin.decorator';

@ApiTags('Keywords')
@Controller('admin/keyword')
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) {}

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '키워드 생성',
    description: '키워드를 생성합니다. 이름은 중복될 수 없습니다.',
  })
  @Post()
  create(@Body() createKeywordDto: CreateKeywordDto) {
    return this.keywordService.create(createKeywordDto);
  }

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '키워드 목록 조회',
    description: '키워드 목록을 조회합니다.',
  })
  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(KEYWORD_CACHEKEY)
  @CacheTTL(CACHE_TTL)
  @Get()
  findAll() {
    return this.keywordService.findAll();
  }

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '키워드 수정',
    description: '키워드의 이름을 수정합니다. 이름은 중복될 수 없습니다.',
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateKeywordDto: UpdateKeywordDto) {
    return this.keywordService.update(+id, updateKeywordDto);
  }

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '키워드 삭제',
    description: '키워드를 삭제합니다.',
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.keywordService.remove(+id);
  }
}
