import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { TranscriptionFavorite } from './entities/transcription-favorite.entity';
import { UserQuote } from '../user-quotes/entities/user-quotes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TranscriptionFavorite, UserQuote])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
