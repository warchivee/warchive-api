import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQuotesController } from './user-quotes.controller';
import { UserQuotesService } from './user-quotes.service';
import { UserQuote } from './entities/user-quotes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserQuote]),
  ],
  controllers: [UserQuotesController],
  providers: [UserQuotesService],
  exports: [UserQuotesService],
})
export class UserQuotesModule {}