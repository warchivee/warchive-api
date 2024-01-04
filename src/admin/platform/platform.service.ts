import { Injectable } from '@nestjs/common';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Platform } from './entities/platform.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(Platform)
    private readonly platformRepository: Repository<Platform>,
  ) {}

  create(createPlatformDto: CreatePlatformDto) {
    return this.platformRepository.save({ ...createPlatformDto });
  }

  findAll() {
    return this.platformRepository.find();
  }

  update(id: number, updatePlatformDto: UpdatePlatformDto) {
    return this.platformRepository.save({ id, ...updatePlatformDto });
  }

  remove(id: number) {
    return this.platformRepository.delete({ id });
  }

  async validate(ids: number[]) {
    if (!ids) return true;
    const findCount = await this.platformRepository.countBy({ id: In(ids) });
    return findCount === ids.length;
  }
}
