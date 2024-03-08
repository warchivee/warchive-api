import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository, EntityNotFoundError } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import {
  TooManyCollectionException,
  TooManyCollectionItemException,
} from 'src/common/exception/service.exception';
import { EntityNotFoundException } from 'src/common/exception/service.exception';
import { CollectionItem } from './entities/collection-item.entity';
import { AddCollectionItemDto } from './dto/add-collection-item.dto';
import { WataService } from '../admin/wata/wata.service';
import { DeleteCollectionItemDto } from './dto/delete-collection-item.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionItem)
    private readonly collectionItemRepository: Repository<CollectionItem>,
    private readonly wataService: WataService,
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

  async addItem(user: User, addCollectionItemDtos: AddCollectionItemDto[]) {
    console.log(addCollectionItemDtos[0].collection_id);
    const collection = await this.findOne(
      addCollectionItemDtos[0].collection_id,
    );

    const [collectionItems, totalCount] =
      await this.collectionItemRepository.findAndCount({
        relations: { collection: true, wata: true },
        where: { collection: { id: collection.id } },
      });

    if (totalCount >= 500) {
      throw TooManyCollectionItemException();
    }

    const saveEntities: CollectionItem[] = [];
    for (const dto of addCollectionItemDtos) {
      const wata = await this.wataService.findOne(dto.wata_id);

      let exist: boolean = false;
      for (const item of collectionItems) {
        if (item.wata.id === dto.wata_id) {
          exist = true;
          break;
        }
      }

      // 중복된 아이템이 있으면 저장 건너뜀
      if (exist) continue;

      const addItem = this.collectionItemRepository.create({
        collection: collection,
        wata: wata,
        adder: user,
        updater: user,
      });

      saveEntities.push(addItem);
    }
    return await this.collectionItemRepository.save(saveEntities);
  }

  async removeItem(deleteCollectionItemDto: DeleteCollectionItemDto[]) {
    try {
      const deletId: number[] = [];
      for (const dto of deleteCollectionItemDto) {
        await this.collectionItemRepository.findOneOrFail({
          where: { id: dto.collection_item_id },
        });

        deletId.push(dto.collection_item_id);
      }

      return await this.collectionItemRepository.delete(deletId);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }
}
