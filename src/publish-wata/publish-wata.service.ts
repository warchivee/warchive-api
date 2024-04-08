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

    // const [total, totalCount] = await this.wataRepository.findAndCount({
    //   order: {
    //   created_at: 'DESC',
    //   id: 'ASC', // 처음에 밀어넣었던 데이터들의 생성 시간이 같아, id 순서로 정렬하는 옵션 추가
    // }});
    // return {total, totalCount};

    try {
      const [total, totalCount] = await this.publishWataRepository.findAndCount({
        order: {
          created_at: 'DESC',
          id: 'ASC',
        },
      });

      console.log(total);

      const categories = await this.keywordsServices.findAllByCategory();

      const watas = total?.map((wata) => {
        return {
          id: wata.id,
          title: wata.title,
          creators: wata.creators,
          genre: wata.genre,
          thumbnail: wata.thumbnail,
          thumbnail_card: wata.thumbnail_card,
          thumbnail_book: wata.thumbnail_book,
          keywords: wata.keywords,
          platforms: wata.platforms,
          cautions: wata.cautions,
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

  async puslish(user: User, publishWatas: SavePublishWataDtoList) {
    let total_cnt = 0;

    let insert_cnt = 0;
    const insert_items = [];

    let update_cnt = 0;
    const update_items = [];

    let delete_cnt = 0;
    const delete_items = [];

    for (const publishWata of publishWatas.data) {
      const wata = await this.wataService.findOne(publishWata.id);

      if (wata.is_published) {
        if (this.checkLabel(wata.label)) {
          const updateWata = await this.publishWataRepository.findOne({
            where: { id: publishWata.id },
          });

          if (updateWata?.updated_at < wata?.updated_at) {
            if (
              publishWata.title &&
              publishWata.creators &&
              publishWata.genre &&
              publishWata.keywords &&
              publishWata.platforms &&
              publishWata.thumbnail_book &&
              publishWata.thumbnail_card
            ) {
              //update
              this.publishWataRepository.save({
                id: publishWata.id,
                title: publishWata.title,
                creators: publishWata.creators,
                thumbnail_card: publishWata.thumbnail_card,
                thumbnail_book: publishWata.thumbnail_book,
                categories: [JSON.stringify(publishWata.category)],
                genre: [JSON.stringify(publishWata.genre)],
                keywords: [JSON.stringify(publishWata.keywords)],
                cautions: [JSON.stringify(publishWata.cautions)],
                platforms: [JSON.stringify(publishWata.platforms)],
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
              id: publishWata.id,
              title: publishWata.title,
              creators: publishWata.creators,
              thumbnail_card: publishWata.thumbnail_card,
              thumbnail_book: publishWata.thumbnail_book,
              categories: [JSON.stringify(publishWata.category)],
              genre: [JSON.stringify(publishWata.genre)],
              keywords: [JSON.stringify(publishWata.keywords)],
              cautions: [JSON.stringify(publishWata.cautions)],
              platforms: [JSON.stringify(publishWata.platforms)],
              adder: user,
              updater: user,
            });

            //wata is_publish true
            await transcationEntityManager.update(Wata, wata.id, {
              is_published: true,
            });
          });

          insert_items.push(wata.id);
          insert_cnt++;
          total_cnt++;
        } else {
          //delete
          this.publishWataRepository.delete(wata.id);
          delete_items.push(wata.id);
          delete_cnt++;
          total_cnt++;
        }
      }
    }

    return {
      total_cnt: total_cnt,
      items: {
        new_watas: {
          total_cnt: insert_cnt,
          items: insert_items,
        },
        update_watas: {
          total_cnt: update_cnt,
          items: update_items,
        },
        delete_watas: {
          total_cnt: delete_cnt,
          items: delete_items,
        },
      },
    };
  }

  private checkLabel(label) {
    if (label === WataLabelType.CHECKED) {
      return true;
    }

    return false;
  }
}
