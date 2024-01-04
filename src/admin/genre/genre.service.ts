import { Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Repository } from 'typeorm';
import { EntityNotFoundException } from 'src/common/exception/service.exception';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  create(categoryId: number, createGenreDto: CreateGenreDto) {
    return this.genreRepository.save({
      category: { id: categoryId },
      ...createGenreDto,
    });
  }

  findAll() {
    return this.genreRepository.find();
  }

  update(categoryId: number, id: number, updateGenreDto: UpdateGenreDto) {
    return this.genreRepository.save({
      id,
      ...updateGenreDto,
      category: {
        id: updateGenreDto.category_id || categoryId,
      },
    });
  }

  remove(categoryId: number, id: number) {
    return this.genreRepository.delete(id);
  }

  async validate(id: number) {
    if (!id) return null;
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) throw EntityNotFoundException('없는 장르입니다.');
    return genre;
  }
}
