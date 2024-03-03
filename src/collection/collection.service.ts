import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { TooManyCollectionException } from 'src/common/exception/service.exception';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  async create(user: User, createCollectionDto: CreateCollectionDto) {
    // 컬렉션 생성 계정당 최대 20개까지
    const collecionMax = await this.collectionRepository.count(); // TODO 사용자 ID 조건에 넣기
    if (collecionMax > 20) {
      throw TooManyCollectionException();
    }

    // TODO XSS prevent

    const createCollection = this.collectionRepository.create({
      title: createCollectionDto.title,
      note: createCollectionDto.note,
      adder: user,
      updater: user,
    } as Collection);

    return await this.collectionRepository.save(createCollection);
  }

  findAll() {
    return `This action returns all collection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} collection`;
  }

  update(id: number, updateCollectionDto: UpdateCollectionDto) {
    return updateCollectionDto;
  }

  remove(id: number) {
    return `This action removes a #${id} collection`;
  }
}
