import { Body, Controller, Post, Req, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserQuotesRecordsService } from './user-quotes-records.service';
import { CreateUserQuoteRecordDto } from './dto/create-user-quotes-records.dto';

@ApiTags('User Quotes Records')
@Controller('transcription/user-quotes-records')
export class UserQuotesRecordsController {
  constructor(private readonly userQuotesRecordsService: UserQuotesRecordsService) {}

  @ApiOperation({
    summary: '필사한 문구 저장',
    description: '사용자가 필사한 문구를 저장합니다.',
  })
  @Post()
  async createRecord(@Request() req, @Body() createUserQuoteRecordDto :CreateUserQuoteRecordDto) {
    const userId = req.user?.id;
    return this.userQuotesRecordsService.createRecord(userId, createUserQuoteRecordDto);
  }
}