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
        console.log(key);
        this.cacheManager.del(key);
      }
    });
  }

  async findAll() {
    console.log('findAll');
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

  async puslish(user: User, publishWatas: SavePublishWataDto[]) {
    let total_cnt = 0;

    let insert_cnt = 0;
    const insert_items = [];

    let update_cnt = 0;
    const update_items = [];

    let delete_cnt = 0;
    const delete_items = [];

    let test = 0;

    const [total, totalCount] = await this.wataRepository.findAndCount({
      order: {
        created_at: 'DESC',
        id: 'ASC',
      },
    })
    // console.log(user);

    // for (const publishWata of publishWatas) {
      for (const wata of total) {
      // const wata = await this.wataService.findOne(publishWata.id);
      test++;
      console.log("publishWata : " + publishWata);
      if (wata.is_published) {
        // console.log("wid" + wata.id);
        // console.log("pid" + publishWata.id);
        // console.log(wata.title);
        // console.log(wata.thumbnail);
        // console.log(wata.thumbnail_book);
        // console.log(wata.thumbnail_card);
        // console.log(wata.genre.category);
        // console.log(publishWata.thumbnail);

        if (this.checkLabel(wata.label)) {
          const updateWata = await this.publishWataRepository.findOne({
            where: { id: wata.id },
          });
          // console.log(updateWata);
          if (updateWata == null) {
            console.log('updateWata is null');
            this.entityManager.transaction(async (transcationEntityManager) => {
              //insert publishWata
              await transcationEntityManager.insert(PublishWata, {
                id: wata.id,
                title: wata.title,
                creators: wata.creators,
                thumbnail: wata.thumbnail,
                thumbnail_card: wata.thumbnail_card,
                thumbnail_book: wata.thumbnail_book,
                genre: wata.genre,
                keywords: wata.keywords,
                cautions: wata.cautions,
                platforms: wata.platforms,
                adder: user,
                updater: user,
              } as PublishWata);
          });
          continue;
        }

          if (updateWata?.updated_at < wata?.updated_at) {
            if (
              wata.title &&
              wata.creators &&
              wata.genre &&
              wata.keywords &&
              wata.platforms &&
              wata.thumbnail &&
              wata.thumbnail_book &&
              wata.thumbnail_card
            ) {
              //update
              this.publishWataRepository.save({
                id: wata.id,
                title: wata.title,
                creators: wata.creators,
                thumbnail: wata.thumbnail,
                thumbnail_card: wata.thumbnail_card,
                thumbnail_book: wata.thumbnail_book,
                genre: wata.genre,
                keywords: wata.keywords,
                cautions: wata.cautions,
                platforms: wata.platforms,
                updater: user,
              });

              update_items.push(wata.id);
              update_cnt++;
              total_cnt++;
            }
          }
        } else {
          //delete
          this.publishWataRepository.delete(wata.id);
          delete_items.push(wata.id);
          delete_cnt++;
          total_cnt++;
        }
      } else {
        if (this.checkLabel(wata.label)) {
          this.entityManager.transaction(async (transcationEntityManager) => {
            //insert publishWata
            await transcationEntityManager.insert(PublishWata, {
              id: wata.id,
              title: wata.title,
              creators: wata.creators,
              thumbnail: wata.thumbnail,
              thumbnail_card: wata.thumbnail_card,
              thumbnail_book: wata.thumbnail_book,
              genre: wata.genre,
              keywords: wata.keywords,
              cautions: wata.cautions,
              platforms: wata.platforms,
              adder: user,
              updater: user,
            });

            //wata is_publish true
            await transcationEntityManager.update(Wata, wata.id, {
              is_published: true,
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

    if (totalCount > 0) {
      this.removeCache();
    }

    return {
      test: test,
      total_cnt: total_cnt,
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
