import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KeywordsService } from 'src/admin/keywords/keywords.service';
import { Wata } from 'src/admin/wata/entities/wata.entity';
import { EntityNotFoundException } from 'src/common/exception/service.exception';
import {
  EntityManager,
  EntityNotFoundError,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { PublishWata } from './entities/publish-wata.entity';
import { WataLabelType } from 'src/admin/wata/interface/wata.type';
import { WataService } from 'src/admin/wata/wata.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PUBLISH_WATA_CACHEKEY } from 'src/admin/wata/httpcache.interceptor';

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

  async create(): Promise<{ createdItems: any[]; createdCount: number }> {
    let createdCount = 0;
    const createdItems = [];

    try {
      // Retrieve all relevant records from wata repository
      const wataRecordsToCreate = await this.wataRepository.find({
        relations: this.wataService.relations,
        where: {
          is_published: false,
          label: WataLabelType.CHECKED,
          title: Not(IsNull()),
          creators: Not(IsNull()),
          thumbnail: Not(IsNull()),
          genre: Not(IsNull()),
          keywords: { keyword: Not(IsNull()) },
          platforms: { platform: Not(IsNull()) },
        },
        order: {
          created_at: 'DESC',
          id: 'ASC',
        },
      });

      // Iterate through each wata record
      for (const wataRecord of wataRecordsToCreate) {
        // Update the publish record with new data
        this.entityManager.transaction(async (transcationEntityManager) => {
          await transcationEntityManager.save(PublishWata, {
            id: wataRecord.id,
            title: wataRecord.title,
            creators: wataRecord.creators,
            thumbnail: wataRecord.thumbnail,
            thumbnail_card: wataRecord.thumbnail_card,
            thumbnail_book: wataRecord.thumbnail_book,
            genre: wataRecord.genre,
            keywords: wataRecord.keywords,
            cautions: wataRecord.cautions,
            platforms: wataRecord.platforms,
            adder: wataRecord.adder,
            updater: wataRecord.updater,
          });

          //wata is_publish true
          await transcationEntityManager.update(Wata, wataRecord.id, {
            is_published: true,
          });
        });
        createdItems.push(wataRecord.id);
        createdCount++;
      }
      console.log('Publish records created successfully.');
    } catch (error) {
      console.error('Error occurred while creating records:', error);
    }
    return { createdItems, createdCount };
  }

  async update(): Promise<{ updatedItems: any[]; updatedCount: number }> {
    let updatedCount = 0;
    const updatedItems = [];

    try {
      // Retrieve all relevant records from wata repository
      const wataRecordsToUpdate = await this.wataRepository.find({
        relations: this.wataService.relations,
        where: {
          is_published: true,
          label: WataLabelType.CHECKED,
          title: Not(IsNull()),
          creators: Not(IsNull()),
          thumbnail: Not(IsNull()),
          genre: Not(IsNull()),
          keywords: { keyword: Not(IsNull()) },
          platforms: { platform: Not(IsNull()) },
        },
        order: {
          created_at: 'DESC',
          id: 'ASC',
        },
      });

      // Iterate through each wata record
      for (const wataRecord of wataRecordsToUpdate) {
        // Find the corresponding publish record using the wata record's ID
        const publishRecordToUpdate =
          await this.publishWataRepository.findOneBy({ id: wataRecord.id });

        // If publish record found and its update_at is older than wata record, update publish record
        if (publishRecordToUpdate.updated_at < wataRecord.updated_at) {
          this.entityManager.transaction(async (transcationEntityManager) => {
            await transcationEntityManager.save(PublishWata, {
              id: wataRecord.id,
              title: wataRecord.title,
              creators: wataRecord.creators,
              thumbnail: wataRecord.thumbnail,
              thumbnail_card: wataRecord.thumbnail_card,
              thumbnail_book: wataRecord.thumbnail_book,
              genre: wataRecord.genre,
              keywords: wataRecord.keywords,
              cautions: wataRecord.cautions,
              platforms: wataRecord.platforms,
              adder: wataRecord.adder,
              updater: wataRecord.updater,
            });
          });

          updatedItems.push(wataRecord.id);
          updatedCount++;
        }
      }
      console.log('Publish records updated successfully.');
    } catch (error) {
      console.error('Error occurred while updating records:', error);
    }
    return { updatedItems, updatedCount };
  }

  async remove(): Promise<{ removedItems: any[]; removedCount: number }> {
    let removedCount = 0;
    const removedItems = [];

    try {
      // Retrieve all relevant records from wata repository
      const wataRecordsToRemove = await this.wataRepository.find({
        where: {
          label: Not(WataLabelType.CHECKED),
        },
        order: {
          created_at: 'DESC',
          id: 'ASC',
        },
      });

      for (const wataRecord of wataRecordsToRemove) {
        if (await this.publishWataRepository.findOneBy({ id: wataRecord.id })) {
          this.publishWataRepository.delete(wataRecord.id);
          removedItems.push(wataRecord.id);
          removedCount++;
        }
      }
      console.log('Publish records deleted successfully.');
    } catch (error) {
      console.error('Error occurred while deleting records:', error);
    }
    return { removedItems, removedCount };
  }

  async publish() {
    const { createdItems, createdCount } = await this.create();
    const { updatedItems, updatedCount } = await this.update();
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
