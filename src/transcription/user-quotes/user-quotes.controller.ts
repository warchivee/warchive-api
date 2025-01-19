import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserQuotesService } from './user-quotes.service';

@ApiTags('User Transcription Quotes')
@Controller('transcription/user-quotes')
export class UserQuotesController {
  constructor(private readonly userQuotesService: UserQuotesService) {}

  @ApiOperation({
    summary: '필사 문구 전체 조회',
    description: '저장된 필사 문구를 모두 조회합니다.',
  })
  @Get()
  getAllQuotesForUsers() {
    return this.userQuotesService.findAllQuotes();
  }
}
