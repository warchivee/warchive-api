import { Injectable } from '@nestjs/common';
import { CreateWataDto } from './dto/create-wata.dto';
import { UpdateWataDto } from './dto/update-wata.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wata } from './entities/wata.entity';
import { Repository } from 'typeorm';
import { UnableDeleteMergedDataException } from 'src/common/exception/service.exception';

@Injectable()
export class WataService {
  constructor(
    @InjectRepository(Wata) private readonly wataRepository: Repository<Wata>,
  ) {}

  create(createWataDto: CreateWataDto) {
    return this.wataRepository.save({ ...createWataDto });
  }

  findAll() {
    return this.wataRepository.find();
  }

  findOne(id: number) {
    return this.wataRepository.findOneBy({ id });
  }

  update(id: number, updateWataDto: UpdateWataDto) {
    return this.wataRepository.save({ id, ...updateWataDto });
  }

  async remove(id: number) {
    const wata = await this.wataRepository.findOneBy({ id });
    if (wata.is_merged) {
      throw UnableDeleteMergedDataException();
    }

    return this.wataRepository.delete({ id, is_merged: false });
  }
}
