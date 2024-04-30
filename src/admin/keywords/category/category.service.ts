import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  KEYWORDS_CACHEKEY,
  KEYWORD_CACHEKEY,
} from 'src/common/utils/httpcache.const';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
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

  create(createCategoryDto: CreateCategoryDto) {
    this.removeCache();
    return this.categoryRepository.save({ ...createCategoryDto });
  }

  findAll() {
    return this.categoryRepository.find({
      relations: {
        genres: true,
      },
      select: {
        id: true,
        name: true,
        genres: {
          id: true,
          name: true,
        },
      },
      order: {
        name: 'ASC',
        genres: {
          name: 'ASC',
        },
      },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    this.removeCache();
    return this.categoryRepository.save({ id, ...updateCategoryDto });
  }

  remove(id: number) {
    this.removeCache();
    return this.categoryRepository.delete({ id });
  }
}
