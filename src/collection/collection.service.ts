import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import {
  Repository,
  EntityNotFoundError,
  EntityManager,
  FindOptionsWhere,
} from 'typeorm';
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
import { Wata } from 'src/admin/wata/entities/wata.entity';
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

  private async whiteSpaceCheck(createCollectionDto: CreateCollectionDto) {
    let note = createCollectionDto.note;
    if (note !== null && note !== undefined) {
      note = note.replaceAll(' ', '');

      if (note === '') {
        return 'Y';
      }
    }
  }

  private async userCheck(user: User, id: number) {
    const result = await this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.adder', 'adder')
      .where('collection.id = :id', { id: id })
      .select(['adder.id'])
      .getRawOne();

    if (user.id !== result.adder_id) {
      throw PermissionDenied();
    }
  }

  async createCollection(user: User, createCollectionDto: CreateCollectionDto) {
    const noteWhiteSpace = await this.whiteSpaceCheck(createCollectionDto);
    if (noteWhiteSpace === 'Y') {
      createCollectionDto.note = null;
    }

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

    const added = await this.collectionRepository.save(createCollection);

    return {
      ...added,
      shared_id: this.sqids.encode([added.id]),
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
      const collection_id = this.sqids.decode(sharedId)[0];

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
        await transactionalEntityManager.delete(Collection, id);

        return id;
      },
    );
  }

  async addItem(user: User, collection_id: number, addIds: number[]) {
    await this.userCheck(user, collection_id);

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
          adder: user,
          updater: user,
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

  async removeItem(collection_id: number, user: User, deleteIds: number[]) {
    await this.userCheck(user, collection_id);

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

  async updateItem(user: User, updateItems: UpdateItemDto[]) {
    const addItems = [];
    let isDelete = false;

    const deleteQueryBuilder = await this.collectionItemRepository
      .createQueryBuilder()
      .delete();

    updateItems.forEach((updateItem) => {
      if (updateItem.action === 'ADD') {
        const item = this.collectionItemRepository.create({
          collection: { id: updateItem?.collection_id } as Collection,
          wata: { id: updateItem?.wata_id } as Wata,
          adder: user,
        });

        addItems.push(item);
      } else if (updateItem.action === 'DELETE') {
        isDelete = true;
        deleteQueryBuilder.orWhere(
          `(wata.id = ${updateItem?.wata_id} and collection.id = ${updateItem?.collection_id} and adder.id = ${user.id})`,
        );
      }
    });

    if (addItems.length !== 0) {
      await this.collectionItemRepository.save(addItems);
    }

    if (isDelete) {
      await deleteQueryBuilder.execute();
    }

    return updateItems;
  }
}
