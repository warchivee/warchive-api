import { Module } from '@nestjs/common';
// import { BookclubReviewService } from './bookclub-review.service';
import { BookclubReviewController } from './bookclub-review.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [BookclubReviewController],
  // providers: [BookclubReviewService],
})
export class BookclubReviewModule {}
