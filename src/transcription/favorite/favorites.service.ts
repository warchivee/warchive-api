import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TranscriptionFavorite } from './entities/transcription-favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UserQuote } from '../user-quotes/entities/user-quotes.entity';
import { FindFavoriteDto } from './dto/find-user-favorite-quotes.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(TranscriptionFavorite)
    private readonly favoritesRepository: Repository<TranscriptionFavorite>,

    @InjectRepository(UserQuote)
    private readonly transcriptionRepository: Repository<UserQuote>,
  ) {}

  async addFavorite(
    userId: number,
    dto: CreateFavoriteDto,
  ) {
    try {
      const existingFavorite = await this.favoritesRepository.findOne({
        where: { user_id: userId, quote_id: dto.quoteId },
      });

      if (existingFavorite) {
        throw new ConflictException('해당 문구는 이미 저장된 문구입니다.');
      }

      const favorite = this.favoritesRepository.create({
        user_id: userId,
        quote_id: dto.quoteId,
      });
      const savedFavorite = await this.favoritesRepository.save(favorite);
      return savedFavorite.id;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '문구 저장 중 오류가 발생했습니다.',
      );
    }
  }

  async getFavoritesByUser(userId: number): Promise<FindFavoriteDto[]> {
    const favorites = await this.favoritesRepository.find({
      where: { user_id: userId },
      select: ['quote_id'],
    });

    const quoteIds = favorites.map((favorite) => favorite.quote_id);

    if (quoteIds.length === 0) {
      return [];
    }

    const quotes = await this.transcriptionRepository.find({
      where: { id: In(quoteIds) },
      order: { created_at: 'DESC' },
    });

    return quotes.map((quote) => {
      const dto = new FindFavoriteDto();
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
