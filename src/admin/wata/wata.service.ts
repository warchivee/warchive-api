import { Injectable } from '@nestjs/common';
import { CreateWataDto } from './dto/create-wata.dto';
import { UpdateWataDto } from './dto/update-wata.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wata } from './entities/wata.entity';
import { Repository } from 'typeorm';

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

  remove(id: number) {
    return this.wataRepository.delete({ id });
  }
}
