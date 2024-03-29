import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository, EntityNotFoundError, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { FindCollectionDto } from './dto/find-collection.dto';
import { FindAllCollectionDto } from './dto/find-all-collection.dto';
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
import { Encrypt } from './collection.crypto';
import { CollectionListResponseDto } from './dto/collection-list.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionItem)
    private readonly collectionItemRepository: Repository<CollectionItem>,
    private readonly wataService: WataService,
    private readonly entityManager: EntityManager,
    private readonly encrypt: Encrypt,
  ) {}

  async createCollection(user: User, createCollectionDto: CreateCollectionDto) {
    // 컬렉션 생성 계정당 최대 20개까지
    const collecionMax = await this.collectionRepository.count({
      where: { adder: { id: user.id } },
    });

    if (collecionMax >= 20) {
      throw TooManyCollectionException();
    }

    const createCollection = this.collectionRepository.create({
      title: createCollectionDto.title,
      note: createCollectionDto.note,
      adder: user,
      updater: user,
    } as Collection);

    return await this.collectionRepository.save(createCollection);
  }

  async findAllCollections(
    FindallCollectionDto: FindAllCollectionDto,
    user: User,
  ) {
    try {
      const [total, totalCount] = await this.collectionRepository.findAndCount({
        where: { adder: { id: user.id } },
        skip: FindallCollectionDto.getSkip(),
        take: FindallCollectionDto.getTake(),
        order: {
          created_at: 'DESC',
        },
      });

      //조회용 암호화된 id 추가
      const result = [];
      total.forEach((collection) => {
        const encryptedText = this.encrypt.encrypt(collection.id);
        result.push(CollectionListResponseDto.of(collection, encryptedText));
      });

      return {
        total_count: totalCount,
        result: result,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async findCollection(findCollectionDto: FindCollectionDto) {
    try {
      //collection_id 복호화
      const collection_id = Number(this.encrypt.decrypt(findCollectionDto.id));

      // collection info
      const collectionInfo = await this.findCollectionInfo(collection_id);

      // items info
      const [itemWataIds, totalCount] =
        await this.findAllItems(findCollectionDto);
      // console.log(itemWataIds);

      return {
        collection_info: collectionInfo,
        collection_items: itemWataIds,
        items_total_count: totalCount,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async findCollectionInfo(id: number) {
    try {
      const collection = await this.collectionRepository.findOneOrFail({
        where: { id },
      });

      return collection;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async findAllItems(findCollectionDto: FindCollectionDto) {
    try {
      //collection_id 복호화
      const collection_id = Number(this.encrypt.decrypt(findCollectionDto.id));

      const [collectionItems, totalCount] =
        await this.collectionItemRepository.findAndCount({
          where: {
            collection: { id: collection_id },
          },
          relations: { wata: true },
          select: ['id', 'wata', 'created_at'],
          skip: findCollectionDto.getSkip(),
          take: findCollectionDto.getTake(),
          order: {
            created_at: 'DESC',
          },
        });

      return [collectionItems.map((row) => row.wata.id), totalCount];
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async updateCollection(id: number, updateCollectionDto: UpdateCollectionDto) {
    await this.findCollectionInfo(id);

    return this.collectionRepository.save({ id, ...updateCollectionDto });
  }

  async removeCollection(id: number) {
    await this.findCollectionInfo(id);

    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const criteria = { collection: { id } };
        await transactionalEntityManager.delete(CollectionItem, criteria);
        await transactionalEntityManager.delete(Collection, id);

        return id;
      },
    );
  }

  async addItem(
    collection_id: number,
    user: User,
    addCollectionItemDtos: AddCollectionItemDto[],
  ) {
    const collection = await this.findCollectionInfo(collection_id);

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
    return this.collectionItemRepository.save(saveEntities);
  }

  async removeItem(
    collection_id: number,
    deleteCollectionItemDto: DeleteCollectionItemDto[],
  ) {
    await this.findCollectionInfo(collection_id);

    try {
      const deletId: number[] = [];
      for (const dto of deleteCollectionItemDto) {
        await this.collectionItemRepository.findOneOrFail({
          where: { id: dto.collection_item_id },
        });

        deletId.push(dto.collection_item_id);
      }

      return this.collectionItemRepository.delete(deletId);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }
}
