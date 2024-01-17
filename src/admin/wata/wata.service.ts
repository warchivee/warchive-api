import { Injectable } from '@nestjs/common';
import { FindWataDto } from './dto/find-wata.dto';
import { CreateWataDto } from './dto/create-wata.dto';
import { UpdateWataDto } from './dto/update-wata.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wata } from './entities/wata.entity';
import {
  EntityManager,
  EntityNotFoundError,
  In,
  Like,
  Repository,
} from 'typeorm';
import {
  EntityNotFoundException,
  UnableDeleteMergedDataException,
  UnableUpdateDataBeforeUpdating,
  UnableUpdatingData,
} from 'src/common/exception/service.exception';
import { WataKeywordMapping } from './entities/wata-keyword.entity';
import { KeywordService } from '../keyword/keyword.service';
import { WataCautionMapping } from './entities/wata-caution.entity';
import { CautionService } from '../caution/caution.service';
import { GenreService } from '../genre/genre.service';
import { PlatformService } from '../platform/platform.service';
import { WataPlatformMapping } from './entities/wata-platform.entity';
import { WataMappingService } from './wata-mapping.service';
import { UpdateWataLabelDto } from './dto/update-wata-label.dto';
import { User } from 'src/user/entities/user.entity';

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
  ];

  async findAll(findWataDto: FindWataDto) {
    const {
      page,
      title,
      creators,
      label,
      categories,
      genres,
      keywords,
      cautions,
      platforms,
    } = findWataDto;

    const findWhereConditions: any = {};

    // title
    if (title) findWhereConditions.title = Like(`%${title}%`);

    // creators
    if (creators) findWhereConditions.creators = Like(`%${creators}%`);

    // label
    if (label) {
      if (typeof label === 'string') findWhereConditions.label = `${label}`;
      else findWhereConditions.label = In(label);
    }

    // category
    if (categories) {
      if (typeof categories === 'string')
        findWhereConditions.genre = { category: { id: categories } };
      else findWhereConditions.genre = { category: { id: In([categories]) } };
    }

    // genre
    if (genres) {
      if (typeof genres === 'string')
        findWhereConditions.genre = { id: genres };
      else findWhereConditions.genre = { id: In(genres) };
    }

    // keyword
    if (keywords) {
      if (typeof keywords === 'string')
        findWhereConditions.keywords = { keyword: { id: keywords } };
      else findWhereConditions.keywords = { keyword: { id: In(keywords) } };
    }

    // caution
    if (cautions) {
      if (typeof cautions === 'string')
        findWhereConditions.cautions = { caution: { id: cautions } };
      else findWhereConditions.cautions = { caution: { id: In(cautions) } };
    }

    // platform
    if (platforms) {
      if (typeof platforms === 'string')
        findWhereConditions.platforms = { platform: { id: platforms } };
      else
        findWhereConditions.platforms = { platform: { id: In(platforms) } };
    }

    // find, pagination, return
    try {
      const take = 10;
      const [total, totalCount] = await this.wataRepository.findAndCount({
        relations: this.relations,
        where: findWhereConditions,
        take,
        skip: (page - 1) * take,
      });

      return await {
        data: total,
        meta: {
          page,
          take,
          totalCount,
          totalPage: Math.ceil(totalCount / take),
        },
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
          thumbnail_url: createWataDto.thumbnail_url,
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

  async updating(user: User, id: number) {
    await this.validate(id);

    return await this.wataRepository.update(id, {
      is_updating: true,
      updater: user,
    });
  }

  async update(user: User, id: number, updateWataDto: UpdateWataDto) {
    const wata = await this.validate(id);

    if (!wata.is_updating) {
      throw UnableUpdateDataBeforeUpdating();
    }

    if (wata.updater.id !== user.id) {
      throw UnableUpdatingData(user.nickname);
    }

    const update = await this.verifyAndGetDataToDto(updateWataDto);

    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(Wata, id, {
          title: updateWataDto.title,
          creators: updateWataDto.creators,
          genre: update.genre,
          thumbnail_url: updateWataDto.thumbnail_url,
          note: updateWataDto.note,
          is_updating: false,
          updater: user,
        } as Wata);

        await this.mappingService.mergeMappings(
          transactionalEntityManager,
          wata,
          update.keywords,
          WataKeywordMapping,
        );

        await this.mappingService.mergeMappings(
          transactionalEntityManager,
          wata,
          update.cautions,
          WataCautionMapping,
        );

        await this.mappingService.mergeMappings(
          transactionalEntityManager,
          wata,
          update.platforms,
          WataPlatformMapping,
        );

        return id;
      },
    );
  }

  async updateLabel(
    user: User,
    id: number,
    updateWataLabelDto: UpdateWataLabelDto,
  ) {
    await this.validate(id);

    return await this.wataRepository.update(id, {
      ...updateWataLabelDto,
      updater: user,
    });
  }

  async remove(id: number) {
    const wata = await this.validate(id);

    if (wata.is_merged) {
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
