import { Injectable } from '@nestjs/common';
import { CreateWataDto } from './dto/create-wata.dto';
import { UpdateWataDto } from './dto/update-wata.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wata } from './entities/wata.entity';
import { EntityManager, Repository } from 'typeorm';
import {
  EntityNotFoundException,
  UnableDeleteMergedDataException,
} from 'src/common/exception/service.exception';
import { WataKeywordMapping } from './entities/wata-keyword.entity';
import { Genre } from '../genre/entities/genre.entity';
import { Keyword } from '../keyword/entities/keyword.entity';
import { KeywordService } from '../keyword/keyword.service';
import { WataCautionMapping } from './entities/wata-caution.entity';
import { CautionService } from '../caution/caution.service';
import { Caution } from '../caution/entities/caution.entity';
import { GenreService } from '../genre/genre.service';
import { PlatformService } from '../platform/platform.service';
import { WataPlatformMapping } from './entities/wata-platform.entity';
import { Platform } from '../platform/entities/platform.entity';

@Injectable()
export class WataService {
  constructor(
    @InjectRepository(Wata) private readonly wataRepository: Repository<Wata>,
    private readonly genreService: GenreService,
    private readonly keywordService: KeywordService,
    private readonly cautionService: CautionService,
    private readonly platformService: PlatformService,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createWataDto: CreateWataDto) {
    if (!(await this.genreService.validate(createWataDto.genre))) {
      throw EntityNotFoundException('없는 장르입니다.');
    }

    if (!(await this.keywordService.validate(createWataDto.keywords))) {
      throw EntityNotFoundException('없는 키워드입니다.');
    }

    if (!(await this.cautionService.validate(createWataDto.cautions))) {
      throw EntityNotFoundException('없는 주의 키워드입니다.');
    }

    if (
      !(await this.platformService.validate(
        createWataDto.platforms?.map((platform) => platform.id),
      ))
    ) {
      throw EntityNotFoundException('없는 플랫폼입니다.');
    }

    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const createdWata = await transactionalEntityManager.save(Wata, {
          title: createWataDto.title,
          creators: createWataDto.creators,
          genre: { id: createWataDto.genre } as Genre,
          thumbnail_url: createWataDto.thumbnail_url,
          note: createWataDto.note,
        } as Wata);

        if (createWataDto.keywords) {
          const keywords = createWataDto.keywords?.map((keyword: number) => {
            return {
              keyword: { id: keyword } as Keyword,
              wata: createdWata,
            } as WataKeywordMapping;
          });

          await transactionalEntityManager.save(WataKeywordMapping, keywords);
        }

        if (createWataDto.cautions) {
          const cautions = createWataDto.keywords?.map((caution: number) => {
            return {
              caution: { id: caution } as Caution,
              wata: createdWata,
            } as WataCautionMapping;
          });

          await transactionalEntityManager.save(WataCautionMapping, cautions);
        }

        if (createWataDto.platforms) {
          const platforms = createWataDto.platforms?.map((platform) => {
            return {
              platform: { id: platform.id } as Platform,
              url: platform.url,
              wata: createdWata,
            } as WataPlatformMapping;
          });

          await transactionalEntityManager.save(WataPlatformMapping, platforms);
        }

        return {
          ...createdWata,
        };
      },
    );
  }

  findAll() {
    return this.wataRepository.find();
  }

  findOne(id: number) {
    return this.wataRepository.findOneBy({ id });
  }

  update(id: number, updateWataDto: UpdateWataDto) {
    return { id, ...updateWataDto };
  }

  async remove(id: number) {
    const wata = await this.wataRepository.findOneBy({ id });
    if (wata.is_merged) {
      throw UnableDeleteMergedDataException();
    }

    return this.wataRepository.delete({ id, is_merged: false });
  }
}
