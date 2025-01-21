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
  ) {
    const newQuote = this.transcriptionRepository.create({
      title: dto.title,
      content: dto.content,
      author: dto.author,
      translator: dto.translator,
      publisher: dto.publisher,
      language: dto.language,
    });
    const savedQuote = await this.transcriptionRepository.save(newQuote);
    return savedQuote.id;
  }
}