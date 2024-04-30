import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository, EntityNotFoundError, EntityManager, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TooManyScrapbookException,
  TooManyScrapbookItemException,
  PermissionDenied,
} from 'src/common/exception/service.exception';
import { EntityNotFoundException } from 'src/common/exception/service.exception';
import { Wata } from 'src/admin/wata/entities/wata.entity';
import Sqids from 'sqids';
import { ConfigService } from '@nestjs/config';
import { UpdateItemDto } from './dto/update-scapbook-item.dto';
import {
  SCRAPBOOKS_LIMMIT_COUNT,
  SCRAPBOOK_ITEMS_LIMIT_COUNT,
} from 'src/common/utils/scrapbook.const';
import { Scrapbook } from './entities/scapbook.entity';
import { ScrapbookItem } from './entities/scapbook-item.entity';
import { CreateScrapbookDto } from './dto/create-scapbook.dto';

@Injectable()
export class ScrapbookService {
  constructor(
    @InjectRepository(Scrapbook)
    private readonly scrapbookRepository: Repository<Scrapbook>,
    @InjectRepository(ScrapbookItem)
    private readonly scrapbookItemRepository: Repository<ScrapbookItem>,
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  private readonly sqids = new Sqids({
    alphabet: this.configService.get('SQIDS_AlPHABET'),
    minLength: 4,
  });

  private getSharedId(id: number) {
    return this.sqids.encode([id]);
  }

  private async checkPermission(user: User, scrapbookId: number | number[]) {
    const scrapbooks = await this.scrapbookRepository.find({
      select: {
        adder: {
          id: true,
        },
      },
      relations: {
        adder: true,
      },
      where: {
        id: Array.isArray(scrapbookId) ? In([...scrapbookId]) : scrapbookId,
        adder: { id: user.id } as User,
      },
    });

    scrapbooks.forEach((scrapbook) => {
      if (scrapbook.adder.id !== user.id) {
        throw PermissionDenied();
      }
    });
  }

  async createScrapbook(user: User, createScrapbookDto: CreateScrapbookDto) {
    // 스크랩북 생성 개수 제한 검사
    const collecionCount = await this.scrapbookRepository.count({
      where: { adder: { id: user.id } },
    });
    if (collecionCount >= SCRAPBOOKS_LIMMIT_COUNT) {
      throw TooManyScrapbookException();
    }

    const createScrapbook = this.scrapbookRepository.create({
      title: createScrapbookDto.title,
      note: createScrapbookDto.note,
      adder: user,
      updater: user,
    } as Scrapbook);

    const added = await this.scrapbookRepository.save(createScrapbook);

    return {
      ...added,
      shared_id: this.getSharedId(added.id),
    };
  }

  async findScrapbooks(user: User) {
    try {
      const result = await this.scrapbookRepository.find({
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

      return result.map((scrapbook) => {
        return {
          id: scrapbook.id,
          shared_id: this.getSharedId(scrapbook.id),
          title: scrapbook.title,
          note: scrapbook.note,
          items: scrapbook?.items?.map((item) => item?.wata?.id),
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

  async findShareScrapbook(sharedId: string) {
    try {
      //scrapbook_id 복호화
      const scrapbook_id = this.sqids.decode(sharedId)[0];

      if (!scrapbook_id) {
        throw EntityNotFoundException();
      }

      // scrapbook info
      const result = await this.scrapbookRepository.findOneOrFail({
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
        where: { id: scrapbook_id },
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

  async updateScrapbook(
    id: number,
    updater: User,
    updateScrapbookDto: CreateScrapbookDto,
  ) {
    this.checkPermission(updater, id);

    return this.scrapbookRepository.save({
      id,
      ...updateScrapbookDto,
      updater: updater,
    });
  }

  async removeScrapbook(updater: User, id: number) {
    await this.checkPermission(updater, id);

    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const criteria = { scrapbook: { id } };
        await transactionalEntityManager.delete(ScrapbookItem, criteria);
        await transactionalEntityManager.delete(Scrapbook, id);

        return id;
      },
    );
  }

  async addItem(adder: User, scrapbook_id: number, addIds: number[]) {
    await this.checkPermission(adder, scrapbook_id);

    const totalCount = await this.scrapbookItemRepository.count({
      relations: { scrapbook: true, wata: true },
      where: { scrapbook: { id: scrapbook_id } },
    });

    if (totalCount >= SCRAPBOOK_ITEMS_LIMIT_COUNT) {
      throw TooManyScrapbookItemException();
    }

    try {
      const saveEntities: ScrapbookItem[] = [];
      for (const id of addIds) {
        const addItem = this.scrapbookItemRepository.create({
          scrapbook: { id: scrapbook_id } as Scrapbook,
          wata: { id: id } as Wata,
          adder: adder,
          updater: adder,
        });

        saveEntities.push(addItem);
      }
      return this.scrapbookItemRepository.save(saveEntities);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async removeItem(scrapbook_id: number, remover: User, deleteIds: number[]) {
    await this.checkPermission(remover, scrapbook_id);

    try {
      const deletId: number[] = [];
      for (const id of deleteIds) {
        const scrapbook_item = await this.scrapbookItemRepository.findOneOrFail(
          {
            where: {
              scrapbook: { id: scrapbook_id },
              wata: { id: id } as Wata,
            },
          },
        );

        deletId.push(scrapbook_item.id);
      }

      return this.scrapbookItemRepository.delete(deletId);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async updateItem(updater: User, updateItems: UpdateItemDto[]) {
    let scrapbookIds = updateItems.map((item) => item.scrapbook_id);
    scrapbookIds = [...new Set(scrapbookIds)];

    await this.checkPermission(updater, scrapbookIds);

    const addItems: ScrapbookItem[] = [];
    let isDelete = false;

    const deleteQueryBuilder = await this.scrapbookItemRepository
      .createQueryBuilder()
      .delete();

    updateItems.forEach((updateItem) => {
      if (updateItem.action === 'ADD') {
        const item = this.scrapbookItemRepository.create({
          scrapbook: { id: updateItem?.scrapbook_id } as Scrapbook,
          wata: { id: updateItem?.wata_id } as Wata,
          adder: updater,
          updater: updater,
        });

        addItems.push(item);
      } else if (updateItem.action === 'DELETE') {
        isDelete = true;
        deleteQueryBuilder.orWhere(
          `(wata.id = ${updateItem?.wata_id} and scrapbook.id = ${updateItem?.scrapbook_id} and adder.id = ${updater.id})`,
        );
      }
    });

    if (addItems.length !== 0) {
      const countByAddItems: Record<number, number> = {};

      addItems.forEach((i) => {
        countByAddItems[i.scrapbook.id] =
          (countByAddItems[i.scrapbook.id] ?? 0) + 1;
      });

      const countByScrapbook = await this.scrapbookItemRepository
        .createQueryBuilder('item')
        .select('item.scrapbook.id', 'id')
        .addSelect('COUNT(item.id)', 'count')
        .groupBy('item.scrapbook.id')
        .where('item.scrapbook.id IN (:...ids)', {
          ids: Object.keys(countByAddItems),
        })
        .execute();

      countByScrapbook.forEach((c) => {
        const currentLength = +c.count + countByAddItems[c.id];

        if (currentLength >= SCRAPBOOK_ITEMS_LIMIT_COUNT) {
          throw TooManyScrapbookItemException();
        }
      });

      await this.scrapbookItemRepository.save(addItems);

      await this.scrapbookItemRepository.count({});
    }

    if (isDelete) {
      await deleteQueryBuilder.execute();
    }

    return updateItems;
  }

  async removeAll(user: User) {
    await this.scrapbookItemRepository.delete({
      adder: user,
    });

    await this.scrapbookRepository.delete({
      adder: user,
    });
  }
}
