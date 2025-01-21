import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserQuote } from './entities/user-quotes.entity';
import { FindTranscriptionQuoteDto } from './dto/find-all-user-quotes.dto';

@Injectable()
export class UserQuotesService {
  constructor(
    @InjectRepository(UserQuote)
    private readonly transcriptionRepository: Repository<UserQuote>,
  ) {}

  async findAllQuotes(): Promise<FindTranscriptionQuoteDto[]> {
    const quotes = await this.transcriptionRepository.find({
      order: { created_at: 'DESC' },
    });

    return quotes.map((quote) => {
      const dto = new FindTranscriptionQuoteDto();
      dto.title = quote.title;
      dto.content = quote.content;
      dto.author = quote.author;
      dto.translator = quote.translator;
      dto.publisher = quote.publisher;
      dto.language = quote.language;
      return dto;
    });
  }
}
