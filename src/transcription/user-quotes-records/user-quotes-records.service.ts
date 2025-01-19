import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserQuotesRecords } from './entities/user-quotes-records.entity';
import { CreateUserQuoteRecordDto } from './dto/create-user-quotes-records.dto';

@Injectable()
export class UserQuotesRecordsService {
  constructor(
    @InjectRepository(UserQuotesRecords)
    private readonly recordsRepository: Repository<UserQuotesRecords>,
  ) {}

  async createRecord(userId: number, createUserQuoteRecordDto: CreateUserQuoteRecordDto): Promise<number> {
    const existingRecord = await this.recordsRepository.findOne({
      where: { user_id: userId, quote_id: createUserQuoteRecordDto.quoteId },
    });

    if (existingRecord) {
      throw new ConflictException('이미 작성한 필사 문구입니다.');
    }

    const newRecord = this.recordsRepository.create({
      user_id: userId, quote_id: createUserQuoteRecordDto.quoteId
    });

    const savedRecord = await this.recordsRepository.save(newRecord);
    return savedRecord.id;
  }
}

