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
}
