import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
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
      },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.save({ id, ...updateCategoryDto });
  }

  remove(id: number) {
    return this.categoryRepository.delete({ id });
  }
}
