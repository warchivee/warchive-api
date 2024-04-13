import { Injectable } from '@nestjs/common';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Platform } from './entities/platform.entity';
import { In, Repository } from 'typeorm';
import { EntityNotFoundException } from 'src/common/exception/service.exception';
import { PlatformWithUrlDto } from 'src/admin/wata/dto/create-wata.dto';

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
    return this.platformRepository.find({
      select: {
        id: true,
        name: true,
        order_top: true,
      },
      order: {
        order_top: 'DESC',
        name: 'ASC',
      },
    });
  }

  update(id: number, updatePlatformDto: UpdatePlatformDto) {
    return this.platformRepository.save({ id, ...updatePlatformDto });
  }

  remove(id: number) {
    return this.platformRepository.delete({ id });
  }

  async validate(platformWithUrlDto: PlatformWithUrlDto[]) {
    if (!platformWithUrlDto) return null;

    const platforms = await this.platformRepository.find({
      where: { id: In(platformWithUrlDto.map((item) => item.id)) },
    });

    if (platforms.length !== platformWithUrlDto.length) {
      throw EntityNotFoundException('없는 플랫폼입니다.');
    }

    return platformWithUrlDto;
  }
}
