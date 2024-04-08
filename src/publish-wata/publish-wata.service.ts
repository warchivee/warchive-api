import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KeywordsService } from 'src/admin/keywords/keywords.service';
import { Wata } from 'src/admin/wata/entities/wata.entity';
import { EntityNotFoundException } from 'src/common/exception/service.exception';
import { EntityNotFoundError, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class PublishWataService {
  constructor(
    @InjectRepository(Wata) private readonly wataRepository: Repository<Wata>,
    private readonly keywordsServices: KeywordsService,
    @InjectRepository(PublishWata)
    private readonly publishWataRepository: Repository<PublishWata>,
    private readonly wataService: WataService,
    private readonly entityManager: EntityManager,
  ) {}

  async findAll() {
    //todo : 조회 테이블을 publish_wata 로 변경
    const findWhereConditions: FindOptionsWhere<Wata> = {};

    findWhereConditions.is_published = true;

    try {
      const [total, totalCount] = await this.wataRepository.findAndCount({
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
        where: findWhereConditions,
        order: {
          created_at: 'DESC',
          id: 'ASC',
        },
      });

      const categories = await this.keywordsServices.findAllByCategory();

      const watas = total?.map((wata) => {
        return {
          id: wata.id,
          title: wata.title,
          creators: wata.creators,
          category: {
            id: wata.genre.category.id,
            name: wata.genre.category.name,
          },
          genre: {
            id: wata.genre.id,
            name: wata.genre.name,
          },
          thumbnail: wata.thumbnail,
          thumbnail_card: wata.thumbnail_card,
          thumbnail_book: wata.thumbnail_book,
          keywords: wata.keywords?.map((item) => {
            return {
              id: item.keyword.id,
              name: item.keyword.name,
            };
          }),
          platforms: wata.platforms?.map((item) => {
            return {
              id: item.platform.id,
              name: item.platform.name,
              url: item.url,
            };
          }),
          cautions: wata.cautions?.map((item) => {
            return {
              id: item.caution.id,
              name: item.caution.name,
            };
          }),
        };
      });

      return {
        total_count: totalCount,
        watas: watas,
        categories: categories,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }
}
