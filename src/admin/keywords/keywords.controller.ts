import { Controller, Get } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Keywords')
@Controller('admin/keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '카테고리 및 하위 장르, 키워드, 주의키워드, 플랫폼 목록 전체 조회',
    description:
      '카테고리 및 하위 장르, 키워드, 주의키워드, 플랫폼 전체 목록을 조회합니다. 키워드 선택 드롭다운, 키워드 목록 조회 등에 사용됩니다.',
  })
  @Get()
  findAll() {
    return this.keywordsService.findAll();
  }
}
