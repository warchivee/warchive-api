import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserQuote } from './entities/user-quotes.entity';

@Injectable()
export class UserQuotesService {
  constructor(
    @InjectRepository(UserQuote)
    private readonly transcriptionRepository: Repository<UserQuote>,
  ) {}

  findAllQuotes(): Promise<UserQuote[]> {
    return this.transcriptionRepository.find({
      order: { created_at: 'DESC' },
    });
  }
}