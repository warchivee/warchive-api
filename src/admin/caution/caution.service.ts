import { Injectable } from '@nestjs/common';
import { CreateCautionDto } from './dto/create-caution.dto';
import { UpdateCautionDto } from './dto/update-caution.dto';
import { Caution } from './entities/caution.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CautionService {
  constructor(
    @InjectRepository(Caution)
    private readonly categoryRepository: Repository<Caution>,
  ) {}

  create(createCautionDto: CreateCautionDto) {
    return this.categoryRepository.save({ ...createCautionDto });
  }

  findAll() {
    return this.categoryRepository.find();
  }

  update(id: number, updateCautionDto: UpdateCautionDto) {
    return this.categoryRepository.save({ id, ...updateCautionDto });
  }

  remove(id: number) {
    return this.categoryRepository.delete({ id });
  }
}
