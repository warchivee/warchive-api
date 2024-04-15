import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KeywordsService } from 'src/admin/keywords/keywords.service';
import { Wata } from 'src/admin/wata/entities/wata.entity';
import { EntityNotFoundException } from 'src/common/exception/service.exception';
import {
  And,
  EntityManager,
  EntityNotFoundError,
  Equal,
  IsNull,
  Not,
  Or,
  Repository,
} from 'typeorm';
import { PublishWata } from './entities/publish-wata.entity';
import { WataLabelType } from 'src/admin/wata/interface/wata.type';
import { WataService } from 'src/admin/wata/wata.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PUBLISH_WATA_CACHEKEY } from 'src/common/utils/httpcache.const';

@Injectable()
export class PublishWataService {
  constructor(
    @InjectRepository(Wata) private readonly wataRepository: Repository<Wata>,
    private readonly keywordsServices: KeywordsService,
    @InjectRepository(PublishWata)
    private readonly publishWataRepository: Repository<PublishWata>,
    private readonly wataService: WataService,
    private readonly entityManager: EntityManager,
    @Inject(CACHE_MANAGER) private cacheManager: any,
  ) {}

  // 지정된 캐시키로 시작되는 캐시 데이터들 삭제
  async removeCache() {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith(PUBLISH_WATA_CACHEKEY)) {
        this.cacheManager.del(key);
      }
    });
  }

  async findAll() {
    try {
      const [total, totalCount] = await this.publishWataRepository.findAndCount(
        {
          order: {
            created_at: 'DESC',
            id: 'ASC',
          },
        },
      );

      const categories = await this.keywordsServices.findAllByCategory();

      const watas = total?.map((wata) => {
        return {
          id: wata.id,
          title: wata.title,
          creators: wata.creators,
          thumbnail: wata.thumbnail,
          thumbnail_card: wata.thumbnail_card,
          thumbnail_book: wata.thumbnail_book,
          genre: wata.genre,
          keywords: wata.keywords,
          platforms: wata.platforms,
          cautions: wata.cautions,
        };
      });

      return {
        total_count: totalCount,
        categories: categories,
        watas: watas,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async upsert(): Promise<{
    createdItems: any[];
    updatedItems: any[];
    createdCount: number;
    updatedCount: number;
  }> {
    let createdCount = 0;
    let updatedCount = 0;
    const createdItems = [];
    const updatedItems = [];

    try {
      // Retrieve all relevant records from wata repository
      const wataRecordsToUpsert = await this.wataRepository.find({
        relations: this.wataService.relations,
        where: {
          // is_published: false,
          label: WataLabelType.CHECKED,
          title: And(Not(IsNull()), Not(Equal(''))),
          creators: And(Not(IsNull()), Not(Equal(''))),
          thumbnail: And(Not(IsNull()), Not(Equal(''))),
          genre: Not(IsNull()),
          keywords: { keyword: Not(IsNull()) },
          platforms: { platform: Not(IsNull()) },
        },
        order: {
          created_at: 'DESC',
          id: 'ASC',
        },
      });

      const publishRecordToUpsert = await this.publishWataRepository.find({
        order: {
          created_at: 'DESC',
          id: 'ASC',
        },
      });

      const upsertItems: PublishWata[] = [];

      const createItems = wataRecordsToUpsert.filter(
        (wata) =>
          !publishRecordToUpsert.map((item) => item.id).includes(wata.id),
      );

      const updateItems = [];

      for (const create of createItems) {
        upsertItems.push(
          this.publishWataRepository.create({
            id: create.id,
            title: create.title,
            creators: create.creators,
            thumbnail: create.thumbnail,
            thumbnail_card: create.thumbnail_card,
            thumbnail_book: create.thumbnail_book,
            genre: create.genre,
            keywords: create.keywords,
            cautions: create.cautions,
            platforms: create.platforms,
            adder: create.adder,
            updater: create.updater,
          }),
        );
        createdItems.push(create.title);
        createdCount++;
        updateItems.push(create.id);
      }

      // Iterate through each wata record
      for (const wataRecord of wataRecordsToUpsert) {
        const publishRecord = publishRecordToUpsert.find(
          (publish) => publish.id === wataRecord.id && wataRecord.is_published,
        );

        if (!publishRecord) continue;

        if (publishRecord.updated_at < wataRecord.updated_at) {
          upsertItems.push(wataRecord);
          updatedItems.push(wataRecord.title);
          updatedCount++;
        }
      }

      // Update the publish record with data
      this.entityManager.transaction(async (transcationEntityManager) => {
        if (updateItems.length > 0) {
          await transcationEntityManager.update(Wata, updateItems, {
            is_published: true,
          });
        }
        await transcationEntityManager.save(PublishWata, upsertItems);
      });

      console.log('Publish records upserted successfully.');
    } catch (error) {
      console.error('Error occurred while creating records:', error);
    }
    return { createdItems, updatedItems, createdCount, updatedCount };
  }

  async remove(): Promise<{ removedItems: any[]; removedCount: number }> {
    let removedCount = 0;
    const removedItems = [];

    const deleteQueryBuilder = this.publishWataRepository
      .createQueryBuilder()
      .delete();

    try {
      // Retrieve all relevant records from wata repository
      const wataRecordsToRemove = await this.wataRepository.find({
        where: [
          { label: Not(WataLabelType.CHECKED) },
          { title: Or(IsNull(), Equal('')) },
          { creators: Or(IsNull(), Equal('')) },
          { thumbnail: Or(IsNull(), Equal('')) },
          { genre: IsNull() },
          { keywords: { keyword: IsNull() } },
          { platforms: { platform: IsNull() } },
        ],
        order: {
          created_at: 'DESC',
          id: 'ASC',
        },
      });

      for (const wataRecord of wataRecordsToRemove) {
        if (await this.publishWataRepository.findOneBy({ id: wataRecord.id })) {
          deleteQueryBuilder.orWhere(`id=${wataRecord.id}`);
          removedItems.push(wataRecord.title);
          removedCount++;
        }
      }

      deleteQueryBuilder.execute();
      console.log('Publish records deleted successfully.');
    } catch (error) {
      console.error('Error occurred while deleting records:', error);
    }
    return { removedItems, removedCount };
  }

  async publish() {
    const { createdItems, updatedItems, createdCount, updatedCount } =
      await this.upsert();
    const { removedItems, removedCount } = await this.remove();

    const totalCount: number = createdCount + updatedCount + removedCount;

    // remove Cache
    if (totalCount > 0) {
      this.removeCache();
    }

    return {
      total_count: totalCount,
      items: {
        new_watas: {
          total_count: createdCount,
          items: createdItems,
        },
        update_watas: {
          total_count: updatedCount,
          items: updatedItems,
        },
        delete_watas: {
          total_count: removedCount,
          items: removedItems,
        },
      },
    };
  }
}
