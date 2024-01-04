import { Injectable } from '@nestjs/common';
import { CreateCautionDto } from './dto/create-caution.dto';
import { UpdateCautionDto } from './dto/update-caution.dto';
import { Caution } from './entities/caution.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from 'src/common/exception/service.exception';

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

  async validate(ids: number[]) {
    if (!ids) return null;
    const cautions = await this.categoryRepository.find({
      where: { id: In(ids) },
    });

    if (cautions.length !== ids.length) {
      throw EntityNotFoundException('없는 주의 키워드입니다.');
    }

    return cautions;
  }
}
