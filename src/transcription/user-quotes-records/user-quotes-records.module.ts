import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQuotesRecords } from './entities/user-quotes-records.entity';
import { UserQuotesRecordsController } from './user-quotes-records.controller';
import { UserQuotesRecordsService } from './user-quotes-records.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserQuotesRecords])],
  controllers: [UserQuotesRecordsController],
  providers: [UserQuotesRecordsService],
  exports: [TypeOrmModule, UserQuotesRecordsService],
})
export class TranscriptionRecordModule {}