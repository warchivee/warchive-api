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
import { KeywordService } from '../keyword/keyword.service';
import { WataCautionMapping } from './entities/wata-caution.entity';
import { CautionService } from '../caution/caution.service';
import { GenreService } from '../genre/genre.service';
import { PlatformService } from '../platform/platform.service';
import { WataPlatformMapping } from './entities/wata-platform.entity';
import { WataMappingService } from './wata-mapping.service';

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

  findAll() {
    return this.wataRepository.find({
      relations: this.relations,
    });
  }

  findOne(id: number) {
    return this.wataRepository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  async create(createWataDto: CreateWataDto) {
    const create = await this.verifyAndGetDataToDto(createWataDto);

    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const createdWata = await transactionalEntityManager.save(Wata, {
          title: createWataDto.title,
          creators: createWataDto.creators,
          genre: create.genre,
          thumbnail_url: createWataDto.thumbnail_url,
          note: createWataDto.note,
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

  async update(id: number, updateWataDto: UpdateWataDto) {
    const wata = await this.findOne(id);

    if (!wata) {
      throw EntityNotFoundException('없는 데이터입니다.');
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

  async remove(id: number) {
    const wata = await this.wataRepository.findOne({ where: { id } });
    if (wata.is_merged) {
      throw UnableDeleteMergedDataException();
    }

    return this.wataRepository.delete({ id, is_merged: false });
  }

  private async verifyAndGetDataToDto(dto: CreateWataDto | UpdateWataDto) {
    const genre = await this.genreService.validate(dto.genre);
    const platforms = await this.platformService.validate(dto.platforms);
    const cautions = await this.cautionService.validate(dto.cautions);
    const keywords = await this.keywordService.validate(dto.keywords);

    return { genre, platforms, cautions, keywords };
  }
}
