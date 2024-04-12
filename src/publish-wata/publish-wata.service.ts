import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KeywordsService } from 'src/admin/keywords/keywords.service';
import { Wata } from 'src/admin/wata/entities/wata.entity';
import { EntityNotFoundException } from 'src/common/exception/service.exception';
import {
  EntityManager,
  EntityNotFoundError,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { SavePublishWataDto } from './dto/save-publish.dto';
import { PublishWata } from './entities/publish-wata.entity';
import { WataLabelType } from 'src/admin/wata/interface/wata.type';
import { User } from 'src/user/entities/user.entity';
import { WataService } from 'src/admin/wata/wata.service';

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
    // console.log("publishWatas : " + publishWatas);
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
              publishWata.title &&
              publishWata.creators &&
              publishWata.genre &&
              publishWata.keywords &&
              publishWata.platforms &&
              publishWata.thumbnail &&
              publishWata.thumbnail_book &&
              publishWata.thumbnail_card
            ) {
              //update
              this.publishWataRepository.save({
                id: publishWata.id,
                title: publishWata.title,
                creators: publishWata.creators,
                thumbnail: publishWata.thumbnail,
                thumbnail_card: [JSON.stringify(publishWata.thumbnail_card)],
                thumbnail_book: [JSON.stringify(publishWata.thumbnail_book)],
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
              thumbnail: publishWata.thumbnail,
              thumbnail_card: [JSON.stringify(publishWata.thumbnail_card)],
              thumbnail_book: [JSON.stringify(publishWata.thumbnail_book)],
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
      test: test,
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
