import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository, EntityNotFoundError, EntityManager, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from './entities/collection.entity';
import {
  TooManyCollectionException,
  TooManyCollectionItemException,
  PermissionDenied,
} from 'src/common/exception/service.exception';
import { EntityNotFoundException } from 'src/common/exception/service.exception';
import { CollectionItem } from './entities/collection-item.entity';
import { AddCollectionItemDto } from './dto/add-collection-item.dto';
import { DeleteCollectionItemDto } from './dto/delete-collection-item.dto';
import { Encrypt } from './collection.crypto';
import { CollectionListResponseDto } from './dto/collection-list.dto';
import { Wata } from 'src/admin/wata/entities/wata.entity';
import { WataLabelType } from 'src/admin/wata/interface/wata.type';
import Sqids from 'sqids';
import { ConfigService } from '@nestjs/config';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionItem)
    private readonly collectionItemRepository: Repository<CollectionItem>,
    @InjectRepository(Wata)
    private readonly wataRepository: Repository<Wata>,
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  private readonly sqids = new Sqids({
    alphabet: this.configService.get('SQIDS_AlPHABET'),
    minLength: 4,
  });

  private async getSharedId(id: number) {
    return this.sqids.encode([id]);
  }

  private async checkPermission(user: User, collectionId: number | number[]) {
    const collections = await this.collectionRepository.find({
      select: {
        adder: {
          id: true,
        },
      },
      relations: {
        adder: true,
      },
      where: {
        id: Array.isArray(collectionId) ? In([...collectionId]) : collectionId,
        adder: { id: user.id } as User,
      },
    });

    collections.forEach((collection) => {
      if (collection.adder.id !== user.id) {
        throw PermissionDenied();
      }
    });
  }

  async createCollection(user: User, createCollectionDto: CreateCollectionDto) {
    // 컬렉션 생성 개수 제한 검사
    const collecionCount = await this.collectionRepository.count({
      where: { adder: { id: user.id } },
    });
    if (collecionCount >= COLLECTIONS_LIMMIT_COUNT) {
      throw TooManyCollectionException();
    }

    const createCollection = this.collectionRepository.create({
      title: createCollectionDto.title,
      note: createCollectionDto.note,
      adder: user,
      updater: user,
    } as Collection);

    const added = await this.collectionRepository.save(createCollection);

    return {
      ...added,
      shared_id: this.getSharedId(added.id),
    };
  }

  async findCollections(user: User) {
    try {
      const result = await this.collectionRepository.find({
        select: {
          id: true,
          title: true,
          note: true,
          items: {
            id: true,
            wata: {
              id: true,
            },
          },
        },
        where: { adder: { id: user.id } },
        relations: {
          items: {
            wata: true,
          },
        },
        order: {
          created_at: 'ASC',
        },
      });

      return result.map((collection) => {
        const encryptedText = this.sqids.encode([collection.id]);
        return {
          id: collection.id,
          shared_id: encryptedText,
          title: collection.title,
          note: collection.note,
          items: collection?.items?.map((item) => item?.wata?.id),
        };
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async findShareCollection(sharedId: string) {
    try {
      //collection_id 복호화
      const collection_id = Number(this.encrypt.decrypt(findCollectionDto.id));

      // collection info
      const result = await this.collectionRepository.findOneOrFail({
        select: {
          id: true,
          title: true,
          note: true,
          items: {
            id: true,
            wata: {
              id: true,
            },
          },
        },
        where: { id: collection_id },
        relations: {
          items: {
            wata: true,
          },
        },
      });

      return {
        id: result.id,
        shared_id: sharedId,
        title: result.title,
        note: result.note,
        items: result?.items?.map((item) => item?.wata?.id),
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async updateCollection(
    id: number,
    updater: User,
    updateCollectionDto: CreateCollectionDto,
  ) {
    await this.userCheck(updater, id);

    const noteWhiteSpace = await this.whiteSpaceCheck(updateCollectionDto);
    if (noteWhiteSpace === 'Y') {
      updateCollectionDto.note = null;
    }

    return this.collectionRepository.save({
      id,
      ...updateCollectionDto,
      updater: updater,
    });
  }

  async removeCollection(user: User, id: number) {
    await this.userCheck(user, id);

    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const criteria = { collection: { id } };
        await transactionalEntityManager.delete(CollectionItem, criteria);
        await transactionalEntityManager.delete(Collection, criteria);

        return id;
      },
    );
  }

  async addItem(adder: User, collection_id: number, addIds: number[]) {
    await this.checkPermission(adder, collection_id);

    const totalCount = await this.collectionItemRepository.count({
      relations: { collection: true, wata: true },
      where: { collection: { id: collection_id } },
    });

    if (totalCount >= 200) {
      throw TooManyCollectionItemException();
    }

    try {
      const saveEntities: CollectionItem[] = [];
      for (const id of addIds) {
        const addItem = this.collectionItemRepository.create({
          collection: { id: collection_id } as Collection,
          wata: { id: id } as Wata,
          adder: adder,
          updater: adder,
        });

        saveEntities.push(addItem);
      }
      return this.collectionItemRepository.save(saveEntities);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async removeItem(collection_id: number, remover: User, deleteIds: number[]) {
    await this.checkPermission(remover, collection_id);

    try {
      const deletId: number[] = [];
      for (const id of deleteIds) {
        const collection_item =
          await this.collectionItemRepository.findOneOrFail({
            where: {
              collection: { id: collection_id },
              wata: { id: id } as Wata,
            },
          });

        deletId.push(collection_item.id);
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

  async updateItem(updater: User, updateItems: UpdateItemDto[]) {
    let collectionIds = updateItems.map((item) => item.collection_id);
    collectionIds = [...new Set(collectionIds)];

    await this.checkPermission(updater, collectionIds);

    const addItems: CollectionItem[] = [];
    let isDelete = false;

    const deleteQueryBuilder = await this.collectionItemRepository
      .createQueryBuilder()
      .delete();

    updateItems.forEach((updateItem) => {
      if (updateItem.action === 'ADD') {
        const item = this.collectionItemRepository.create({
          collection: { id: updateItem?.collection_id } as Collection,
          wata: { id: updateItem?.wata_id } as Wata,
          adder: updater,
          updater: updater,
        });

        addItems.push(item);
      } else if (updateItem.action === 'DELETE') {
        isDelete = true;
        deleteQueryBuilder.orWhere(
          `(wata.id = ${updateItem?.wata_id} and collection.id = ${updateItem?.collection_id} and adder.id = ${updater.id})`,
        );
      }
    });

    if (addItems.length !== 0) {
      const countByCollection = await this.collectionItemRepository
        .createQueryBuilder('item')
        .select('item.collection.id', 'id')
        .addSelect('COUNT(item.id)', 'count')
        .groupBy('item.collection.id')
        .execute();

      const countByAddItems: Record<number, number> = {};

      addItems.forEach((i) => {
        countByAddItems[i.collection.id] =
          (countByAddItems[i.collection.id] ?? 0) + 1;
      });

      countByCollection.forEach((c) => {
        const currentLength = c.count + countByAddItems[c.id];

        if (currentLength >= COLLECTION_ITEMS_LIMIT_COUNT) {
          throw TooManyCollectionItemException();
        }
      });

      await this.collectionItemRepository.save(addItems);

      await this.collectionItemRepository.count({});
    }

    if (isDelete) {
      await deleteQueryBuilder.execute();
    }

    return updateItems;
  }

  async removeAll(user: User) {
    await this.collectionItemRepository.delete({
      adder: user,
    });

    await this.collectionRepository.delete({
      adder: user,
    });
  }
}
