import { Injectable } from '@nestjs/common';
import { FindWataDto } from './dto/find-wata.dto';
import { CreateWataDto } from './dto/create-wata.dto';
import { UpdateWataDto } from './dto/update-wata.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wata } from './entities/wata.entity';
import {
  Between,
  EntityManager,
  EntityNotFoundError,
  FindOptionsWhere,
  In,
  IsNull,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Raw,
  Repository,
} from 'typeorm';
import {
  EntityNotFoundException,
  UnableDeleteMergedDataException,
} from 'src/common/exception/service.exception';
import { WataKeywordMapping } from './entities/wata-keyword.entity';
import { WataCautionMapping } from './entities/wata-caution.entity';
import { WataPlatformMapping } from './entities/wata-platform.entity';
import { WataMappingService } from './wata-mapping.service';
import { User } from 'src/user/entities/user.entity';
import { GenreService } from '../keywords/genre/genre.service';
import { KeywordService } from '../keywords/keyword/keyword.service';
import { CautionService } from '../keywords/caution/caution.service';
import { PlatformService } from '../keywords/platform/platform.service';
import { WataRequiredValuesColumnInfo } from './interface/wata.type';

@Injectable()
export class WataService {
  constructor(
    @InjectRepository(Wata) private readonly wataRepository: Repository<Wata>,
    private readonly genreService: GenreService,
    private readonly keywordService: KeywordService,
    private readonly cautionService: CautionService,
    private readonly platformService: PlatformService,
    private readonly mappingService: WataMappingService,
    private readonly entityManager: EntityManager,
  ) {}

  relations = [
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
  ];

  async findAll(findWataDto: FindWataDto) {
    const {
      page,
      page_size,
      title,
      creators,
      label,
      categories,
      genres,
      keywords,
      cautions,
      platforms,
      updateStartDate,
      updateEndDate,
      isPublished,
      needWriteItems,
    } = findWataDto;

    const findWhereConditions: FindOptionsWhere<Wata>[] = [];
    const itemValueCorrectConditions: FindOptionsWhere<Wata> = {};

    // title
    if (title)
      itemValueCorrectConditions.title = Raw(
        (alias) => `replace(${alias}, ' ', '') like :title`,
        { title: `%${title?.replace(' ', '')}%` },
      );

    // creators
    if (creators)
      itemValueCorrectConditions.creators = Raw(
        (alias) => `replace(${alias}, ' ', '') like :creators`,
        { creators: `%${creators?.replace('/', '')?.replace(' ', '')}%` },
      );

    // label
    if (label) {
      itemValueCorrectConditions.label = In(label);
    }

    // category
    if (categories) {
      itemValueCorrectConditions.genre = { category: { id: In(categories) } };
    }

    // genre
    if (genres) {
      itemValueCorrectConditions.genre = { id: In(genres) };
    }

    // keyword
    if (keywords) {
      itemValueCorrectConditions.keywords = { keyword: { id: In(keywords) } };
    }

    // caution
    if (cautions) {
      itemValueCorrectConditions.cautions = { caution: { id: In(cautions) } };
    }

    // platform
    if (platforms) {
      itemValueCorrectConditions.platforms = {
        platform: { id: In(platforms) },
      };
    }

    const startDate = updateStartDate
      ? new Date(
          Date.UTC(
            updateStartDate.getUTCFullYear(),
            updateStartDate.getUTCMonth(),
            updateStartDate.getUTCDate(),
            23,
            59,
            59,
          ),
        )
      : null;

    const endDate = updateEndDate
      ? new Date(
          Date.UTC(
            updateEndDate.getUTCFullYear(),
            updateEndDate.getUTCMonth(),
            updateEndDate.getUTCDate(),
            23,
            59,
            59,
          ),
        )
      : null;

    if (startDate && endDate) {
      itemValueCorrectConditions.updated_at = Between(startDate, endDate);
    } else if (startDate) {
      itemValueCorrectConditions.updated_at = MoreThanOrEqual(startDate);
    } else if (endDate) {
      itemValueCorrectConditions.updated_at = LessThanOrEqual(endDate);
    }

    if (isPublished != undefined) {
      itemValueCorrectConditions.is_published = isPublished;
    }

    // 필수 입력값들 중 비어있는 경우를 조회
    if (needWriteItems) {
      needWriteItems.forEach((item) => {
        const columnInfo = WataRequiredValuesColumnInfo[item];

        if (columnInfo.type == 'string') {
          findWhereConditions.push({
            ...itemValueCorrectConditions,
            [columnInfo.name]: IsNull(),
          });
          findWhereConditions.push({
            ...itemValueCorrectConditions,
            [columnInfo.name]: Like(''),
          });
        } else if (columnInfo.type == 'fk') {
          findWhereConditions.push({
            ...itemValueCorrectConditions,
            [columnInfo.name]: IsNull(),
          });
        } else if (columnInfo.type == 'mapping-many') {
          findWhereConditions.push({
            ...itemValueCorrectConditions,
            [columnInfo.name]: {
              [columnInfo.mappingColumnName]: { id: IsNull() },
            },
          });
        }
      });
    } else {
      findWhereConditions.push(itemValueCorrectConditions);
    }

    // find, pagination, return
    try {
      const [total, totalCount] = await this.wataRepository.findAndCount({
        relations: this.relations,
        where: findWhereConditions,
        take: page_size,
        skip: (page - 1) * page_size,
        order: {
          created_at: 'DESC',
        },
      });

      const result = total?.map((wata) => {
        return {
          ...wata,
          adder: {
            id: wata?.adder?.id,
            nickname: wata?.adder?.nickname,
          },
          updater: {
            id: wata?.updater?.id,
            nickname: wata?.updater?.nickname,
          },
          keywords: wata.keywords?.map((item) => {
            return {
              mapping_id: item?.id,
              ...item?.keyword,
            };
          }),
          platforms: wata.platforms?.map((item) => {
            return {
              mapping_id: item?.id,
              url: item?.url,
              ...item?.platform,
            };
          }),
          cautions: wata.cautions?.map((item) => {
            return {
              mapping_id: item?.id,
              ...item?.caution,
            };
          }),
        };
      });

      return await {
        total_count: totalCount,
        result: result,
        // TODO: 0 이하 예외 처리 -> 첫 번째 페이지 나오게
        // TODO: 페이지 초과 예외 처리 -> 마지막 페이지 나오게
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async findOne(id: number) {
    try {
      return await this.wataRepository.findOneOrFail({
        where: { id },
        relations: this.relations,
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async create(user: User, createWataDto: CreateWataDto) {
    const create = await this.verifyAndGetDataToDto(createWataDto);

    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const createdWata = await transactionalEntityManager.save(Wata, {
          title: createWataDto.title,
          creators: createWataDto.creators,
          genre: create.genre,
          thumbnail_card: createWataDto.thumbnail_card,
          thumbnail_book: createWataDto.thumbnail_book,
          note: createWataDto.note,
          adder: user,
          updater: user,
        } as Wata);

        await this.mappingService.createKeywordMappings(
          transactionalEntityManager,
          createdWata,
          create.keywords,
        );

        await this.mappingService.createCautionMappings(
          transactionalEntityManager,
          createdWata,
          create.cautions,
        );

        await this.mappingService.createPlatformMappings(
          transactionalEntityManager,
          createdWata,
          create.platforms,
        );

        return createdWata.id;
      },
    );
  }

  async update(user: User, id: number, updateWataDto: UpdateWataDto) {
    const wata = await this.validate(id);

    const update = await this.verifyAndGetDataToDto(updateWataDto);

    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(Wata, id, {
          title: updateWataDto.title ?? wata.title,
          creators: updateWataDto.creators ?? wata.creators,
          genre: updateWataDto.genre ? update.genre : wata.genre,
          thumbnail_card: updateWataDto.thumbnail_card ?? wata.thumbnail_card,
          thumbnail_book: updateWataDto.thumbnail_book ?? wata.thumbnail_book,
          note: updateWataDto.note ?? wata.note,
          label: updateWataDto.label ?? wata.label,
          updater: user,
        } as Wata);

        if (updateWataDto.keywords) {
          await this.mappingService.mergeMappings(
            transactionalEntityManager,
            wata,
            update.keywords,
            WataKeywordMapping,
          );
        }

        if (updateWataDto.cautions) {
          await this.mappingService.mergeMappings(
            transactionalEntityManager,
            wata,
            update.cautions,
            WataCautionMapping,
          );
        }

        if (updateWataDto.platforms) {
          await this.mappingService.mergeMappings(
            transactionalEntityManager,
            wata,
            update.platforms,
            WataPlatformMapping,
          );
        }

        return id;
      },
    );
  }

  async remove(id: number) {
    const wata = await this.validate(id);

    if (wata.is_published) {
      throw UnableDeleteMergedDataException();
    }

    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const criteria = { wata: { id } };
        await transactionalEntityManager.delete(WataKeywordMapping, criteria);
        await transactionalEntityManager.delete(WataCautionMapping, criteria);
        await transactionalEntityManager.delete(WataPlatformMapping, criteria);

        await transactionalEntityManager.delete(Wata, id);

        return id;
      },
    );
  }

  private async validate(id: number) {
    const wata = await this.findOne(id);

    if (!wata) {
      throw EntityNotFoundException('없는 데이터입니다.');
    }

    return wata;
  }

  private async verifyAndGetDataToDto(dto: CreateWataDto | UpdateWataDto) {
    const genre = await this.genreService.validate(dto.genre);
    const platforms = await this.platformService.validate(dto.platforms);
    const cautions = await this.cautionService.validate(dto.cautions);
    const keywords = await this.keywordService.validate(dto.keywords);

    return { genre, platforms, cautions, keywords };
  }
}
