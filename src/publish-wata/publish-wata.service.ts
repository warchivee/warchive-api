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
  FindOptionsWhere,
  In,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { PublishWata } from './entities/publish-wata.entity';
import { WataLabelType } from 'src/admin/wata/interface/wata.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PUBLISH_WATA_CACHEKEY } from 'src/common/utils/httpcache.const';
import { FilterPublishWataDto } from './dto/FilterPublishWata.dto';

@Injectable()
export class PublishWataService {
  constructor(
    @InjectRepository(Wata) private readonly wataRepository: Repository<Wata>,
    private readonly keywordsServices: KeywordsService,
    @InjectRepository(PublishWata)
    private readonly publishWataRepository: Repository<PublishWata>,
    private readonly entityManager: EntityManager,
    @Inject(CACHE_MANAGER) private cacheManager: any,
  ) {}

  private mapToPublishWata(wata: Wata) {
    return {
      id: wata.id,
      title: wata.title,
      creators: wata.creators,
      thumbnail: wata.thumbnail,
      thumbnail_card: wata.thumbnail_card,
      thumbnail_book: wata.thumbnail_book,
      category: {
        id: wata.genre.category.id,
      },
      genre: {
        id: wata.genre.id,
      },
      keywords: wata.keywords?.map((k) => {
        return { id: k.keyword.id };
      }),
      cautions: wata.cautions?.map((c) => {
        return { id: c.caution.id };
      }),
      platforms: wata.platforms?.map((p) => {
        return { id: p.platform.id, url: p.url };
      }),
      created_at: wata.created_at,
      updated_at: wata.updated_at,
    };
  }

  // 지정된 캐시키로 시작되는 캐시 데이터들 삭제
  async removeCache() {
    const removedKeys = [];
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith(PUBLISH_WATA_CACHEKEY)) {
        this.cacheManager.del(key);
        removedKeys.push(key);
      }
    });
    return removedKeys;
  }

  async findAll() {
    try {
      const [watas, totalCount] = await this.publishWataRepository.findAndCount(
        {
          order: {
            created_at: 'DESC',
            id: 'DESC',
          },
        },
      );

      const categories = await this.keywordsServices.findAllByCategory();

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

  async update(filterPublishWataDto: FilterPublishWataDto): Promise<{
    createdItems: string[];
    updatedItems: string[];
    deletedItems: string[];
  }> {
    const createdItems: string[] = [];
    const updatedItems: string[] = [];
    const deletedItems: string[] = [];

    try {
      const createWatas: PublishWata[] = [];
      const updateWatas: PublishWata[] = [];

      const isTitleFilter =
        filterPublishWataDto &&
        Array.isArray(filterPublishWataDto.titles) &&
        filterPublishWataDto.titles.length > 0;

      // 업데이트할 데이터의 id 를 조회한다.
      const wataRecordsToUpdateIdsQuery = this.wataRepository
        .createQueryBuilder('w')
        .select(`w.id as id`)
        .distinct(true)
        .innerJoin(
          PublishWata,
          'pw',
          `w.id = pw.id 
          AND DATE_TRUNC('second', pw.updated_at ) != DATE_TRUNC('second', w.updated_at)`,
        )
        .leftJoin('wata_keyword', 'wk', 'wk.wata_id = w.id')
        .leftJoin('wata_platform', 'wp', 'wp.wata_id = w.id')
        .where(`w.label = :label`, { label: 'CHECKED' })
        .andWhere(`w.thumbnail IS NOT NULL AND w.thumbnail != ''`)
        .andWhere(`w.genre_id IS NOT NULL`)
        .andWhere(`wk.id IS NOT NULL`)
        .andWhere(`wp.id IS NOT NULL`)
        .andWhere(`w.is_published = :isPublished`, {
          isPublished: true,
        });

      // 아티클, 인터뷰 작업 등으로 특정 데이터만 업데이트 필요한 경우
      if (isTitleFilter) {
        wataRecordsToUpdateIdsQuery.andWhere(`w.title IN (:...titles)`, {
          titles: filterPublishWataDto.titles,
        });
      }

      const wataRecordsToUpdateIds =
        await wataRecordsToUpdateIdsQuery.getRawMany();

      // 입력할 데이터 조건
      const find: FindOptionsWhere<Wata>[] = [
        {
          label: WataLabelType.CHECKED,
          title: And(Not(IsNull()), Not(Equal(''))),
          creators: And(Not(IsNull()), Not(Equal(''))),
          thumbnail: And(Not(IsNull()), Not(Equal(''))),
          genre: Not(IsNull()),
          keywords: { keyword: Not(IsNull()) },
          platforms: { platform: Not(IsNull()) },
          is_published: false,
        },
      ];

      //입력할 데이터 조건에 업데이트하는 데이터 id 들도 추가
      if (wataRecordsToUpdateIds.length > 0) {
        find.push({ id: In(wataRecordsToUpdateIds?.map(({ id }) => +id)) });
      }

      if (isTitleFilter) {
        find[0] = { ...find[0], title: In(filterPublishWataDto.titles) };
      }

      const wataRecordsToUpsert = await this.wataRepository.find({
        relations: [
          'genre.category',
          'genre',
          'keywords',
          'keywords.keyword',
          'cautions',
          'cautions.caution',
          'platforms',
          'platforms.platform',
          'updater',
          'adder',
        ],
        where: find,
        order: {
          created_at: 'ASC',
          id: 'ASC',
        },
      });

      for (const wata of wataRecordsToUpsert) {
        if (wata.is_published === true) {
          updateWatas.push(this.mapToPublishWata(wata));
        } else {
          createWatas.push(this.mapToPublishWata(wata));
        }
      }

      let deleteWatas = [];
      let deleteWatasAndConditions = `(w.label != :label AND w.is_published = :isPublished) 
          OR w.thumbnail IS NULL 
          OR w.thumbnail = :emptyThumbnail
          OR w.genre_id IS NULL 
          OR wk.id IS NULL
          OR wp.id IS NULL`;

      if (isTitleFilter) {
        deleteWatasAndConditions = `(${deleteWatasAndConditions}) AND w.title IN (:...titles)`;
      }

      // 삭제할 데이터를 조회한다.
      deleteWatas = await this.publishWataRepository
        .createQueryBuilder('pw')
        .select(`pw.id, pw.title`)
        .distinct(true)
        .innerJoin(
          'wata',
          'w',
          `w.id = pw.id 
          AND DATE_TRUNC('second', w.updated_at) !=  DATE_TRUNC('second', pw.updated_at)`,
        )
        .leftJoin('wata_keyword', 'wk', 'wk.wata_id = w.id')
        .leftJoin('wata_platform', 'wp', 'wp.wata_id = w.id')
        .where(deleteWatasAndConditions, {
          label: 'CHECKED',
          isPublished: true,
          emptyThumbnail: '',
          titles: filterPublishWataDto.titles,
        })
        .getRawMany();

      // delete -> update -> create
      this.entityManager.transaction(async (transcationEntityManager) => {
        if (deleteWatas.length > 0) {
          await transcationEntityManager.delete(PublishWata, {
            id: In(deleteWatas?.map((w) => +w.id)),
          });

          console.log('Publish records deleted successfully.');
        }

        // save 하면 find 후 insert or update 함 (query 2번 날림)
        if (updateWatas.length > 0) {
          for (const updateWata of updateWatas) {
            await transcationEntityManager.update(
              PublishWata,
              updateWata.id,
              updateWata,
            );
          }

          console.log('Publish records updated successfully.');
        }

        if (createWatas.length > 0) {
          await transcationEntityManager.insert(PublishWata, createWatas);

          // 처음으로 게시되는 데이터의 is_published 컬럼 업데이트
          await transcationEntityManager.update(
            Wata,
            {
              id: In(createWatas?.map((c) => c.id)),
            },
            {
              is_published: true,
            },
          );

          // 게시됐다가 내려간 데이터의 게시여부 수정
          await transcationEntityManager.update(
            Wata,
            {
              id: In(deleteWatas?.map((c) => c.id)),
            },
            {
              is_published: false,
            },
          );

          console.log('Publish records created successfully.');
        }
      });

      return {
        createdItems: createWatas?.map((w) => w.title),
        updatedItems: updateWatas?.map((w) => w.title),
        deletedItems: deleteWatas?.map((w) => w.title),
      };
    } catch (error) {
      console.error(
        'Error occurred while updating publish wata records:',
        error,
      );
    }

    return {
      createdItems,
      updatedItems,
      deletedItems,
    };
  }

  async publish(filterPublishWataDto?: FilterPublishWataDto) {
    const { createdItems, updatedItems, deletedItems } =
      await this.update(filterPublishWataDto);

    const totalCount: number =
      createdItems.length + updatedItems.length + deletedItems.length;

    // Remove Cache
    if (totalCount > 0) {
      this.removeCache();
    }

    return {
      total_count: totalCount,
      items: {
        new_watas: {
          total_count: createdItems.length,
          items: createdItems,
        },
        update_watas: {
          total_count: updatedItems.length,
          items: updatedItems,
        },
        delete_watas: {
          total_count: deletedItems.length,
          items: deletedItems,
        },
      },
    };
  }
}
