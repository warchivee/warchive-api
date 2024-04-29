import { Inject, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Repository } from 'typeorm';
import { EntityNotFoundException } from 'src/common/exception/service.exception';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  KEYWORD_CACHEKEY,
  KEYWORDS_CACHEKEY,
} from 'src/admin/wata/httpcache.interceptor';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @Inject(CACHE_MANAGER) private cacheManager: any,
  ) {}
  async removeCache() {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (
        key.startsWith(KEYWORD_CACHEKEY) ||
        key.startsWith(KEYWORDS_CACHEKEY)
      ) {
        this.cacheManager.del(key);
      }
    });
  }

  create(categoryId: number, createGenreDto: CreateGenreDto) {
    this.removeCache();
    return this.genreRepository.save({
      category: { id: categoryId },
      ...createGenreDto,
    });
  }

  findAll() {
    return this.genreRepository.find();
  }

  update(categoryId: number, id: number, updateGenreDto: UpdateGenreDto) {
    this.removeCache();
    return this.genreRepository.save({
      id,
      ...updateGenreDto,
      category: {
        id: updateGenreDto.category_id || categoryId,
      },
    });
  }

  remove(categoryId: number, id: number) {
    this.removeCache();
    return this.genreRepository.delete(id);
  }

  async validate(id: number) {
    if (!id) return null;
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) throw EntityNotFoundException('없는 장르입니다.');
    return genre;
  }
}
