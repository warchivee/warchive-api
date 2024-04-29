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
import { PUBLISH_WATA_CACHEKEY } from 'src/admin/wata/httpcache.interceptor';
import { UpsertPublishWataDto } from './dto/upsert-publish-wata.dto';

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

      // Retrieve all records from publish wata repository
      const publishRecordToUpsert = await this.publishWataRepository.find({
        order: {
          created_at: 'DESC',
          id: 'ASC',
        },
      });

      const upsertItems: PublishWata[] = [];
      const upsertItemsToSave: UpsertPublishWataDto[] = [];

      const createItems = wataRecordsToUpsert.filter(
        (wata) =>
          !publishRecordToUpsert.map((item) => item.id).includes(wata.id),
      );

      const updateToIsPublishedTrue = [];

      for (const createItem of createItems) {
        upsertItems.push(createItem);
        createdItems.push(createItem.title);
        createdCount++;
        if (createItem.is_published == false) {
          updateToIsPublishedTrue.push(createItem.id);
        }
      }

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

      // Update is_published from false to true
      this.entityManager.transaction(async (transcationEntityManager) => {
        if (updateToIsPublishedTrue.length > 0) {
          await transcationEntityManager.update(Wata, updateToIsPublishedTrue, {
            is_published: true,
          });
        }

        // Map the raw data to DTO format
        for (const upsertItem of upsertItems) {
          const item: UpsertPublishWataDto = new UpsertPublishWataDto();
          item.id = upsertItem.id;
          item.title = upsertItem.title;
          item.creators = upsertItem.creators;
          item.thumbnail = upsertItem.thumbnail;
          item.thumbnail_card = upsertItem.thumbnail_card;
          item.thumbnail_book = upsertItem.thumbnail_book;
          item.genre = {
            id: upsertItem.genre.id,
            name: upsertItem.genre.name,
            category: {
              id: upsertItem.genre.category.id,
              name: upsertItem.genre.category.name,
            },
          };
          item.keywords = upsertItem.keywords?.map((keyword) => {
            return {
              id: keyword.keyword.id,
              name: keyword.keyword.name,
            };
          });
          item.cautions = upsertItem.cautions?.map((caution) => {
            return {
              id: caution.caution.id,
              name: caution.caution.name,
              required: caution.caution.required,
            };
          });
          item.platforms = upsertItem.platforms?.map((platform) => {
            return {
              id: platform.platform.id,
              name: platform.platform.name,
              url: platform.url,
              order_top: platform.platform.order_top,
            };
          });
          item.adder = {
            id: upsertItem.adder?.id,
            name: upsertItem.adder?.nickname,
          };
          item.updater = {
            id: upsertItem.updater?.id,
            name: upsertItem.updater?.nickname,
          };

          upsertItemsToSave.push(item);
        }

        // Save the create & update data to published_wata table
        await transcationEntityManager.save(PublishWata, upsertItemsToSave);
      });

      console.log('Publish records upserted successfully.');
    } catch (error) {
      console.error('Error occurred while upserting records:', error);
    }
    return { createdItems, updatedItems, createdCount, updatedCount };
  }

  async remove(): Promise<{ removedItems: any[]; removedCount: number }> {
    let removedCount = 0;
    const removedItems = [];

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
      });

      // 뻐른 종료 (클린코드.)
      if (!wataRecordsToRemove || wataRecordsToRemove.length <= 0) {
        return { removedItems, removedCount };
      }

      const deleteIds = [];

      for (const wataRecord of wataRecordsToRemove) {
        if (await this.publishWataRepository.findOneBy({ id: wataRecord.id })) {
          deleteIds.push(wataRecord.id);
          removedItems.push(wataRecord.title);
          removedCount++;
        }
      }

      // 만약에 deleteId가 아무것도 없으면 delete all 실행되므로 안전을 위해 넣음
      if (deleteIds.length <= 0) {
        return { removedItems, removedCount };
      }

      const deleteQueryBuilder = this.publishWataRepository
        .createQueryBuilder()
        .delete();

      deleteQueryBuilder.whereInIds(deleteIds);
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

    // Remove Cache
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
