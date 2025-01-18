import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuotesService } from './quotes.service';
import { CreateTranscriptionQuoteDto } from './dto/create-quote.dto';
import { Admin } from 'src/common/decorators/admin.decorator';

@ApiTags('Transcription Quotes')
@Controller('admin/transcription/quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '필사 문구 데이터 생성',
    description: '필사 프로젝트 문구 데이터를 생성합니다.',
  })
  @Post()
  create(@Body() createTranscriptionQuoteDto: CreateTranscriptionQuoteDto) {
    return this.quotesService.createQuote(createTranscriptionQuoteDto);
  }
}