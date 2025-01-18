import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTranscriptionQuoteDto } from './dto/create-quote.dto';
import { TranscriptionQuote } from './entities/quote.entity';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(TranscriptionQuote)
    private readonly transcriptionRepository: Repository<TranscriptionQuote>,
  ) {}

  async createQuote(
    dto: CreateTranscriptionQuoteDto,
  ): Promise<TranscriptionQuote> {
    const newQuote = this.transcriptionRepository.create({
      content: dto.content,
      author: dto.author,
    });
    return await this.transcriptionRepository.save(newQuote);
  }
}