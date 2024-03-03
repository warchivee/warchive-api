import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository, EntityNotFoundError } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { TooManyCollectionException } from 'src/common/exception/service.exception';
import { EntityNotFoundException } from 'src/common/exception/service.exception';

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

  async findOne(id: number) {
    try {
      // 단일 컬렉션 info
      const collection = await this.collectionRepository.findOneOrFail({
        where: { id },
      });

      // TODO 컬랙션에 해당하는 아이템들을 묶어서 같이 던질지 or 프론트에서 따로 호출할지
      // 전자로 할 경우 validcheck 따로 빼기
      return collection;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  update(id: number, updateCollectionDto: UpdateCollectionDto) {
    return updateCollectionDto;
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.collectionRepository.delete({ id });
  }
}
