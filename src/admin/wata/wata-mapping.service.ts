import { Injectable } from '@nestjs/common';
import { Wata } from './entities/wata.entity';
import { WataKeywordMapping } from './entities/wata-keyword.entity';
import { WataCautionMapping } from './entities/wata-caution.entity';
import { PlatformWithUrlDto } from './dto/create-wata.dto';
import { WataPlatformMapping } from './entities/wata-platform.entity';
import { EntityManager } from 'typeorm';
import { Keyword } from '../keywords/keyword/entities/keyword.entity';
import { Caution } from '../keywords/caution/entities/caution.entity';
import { Platform } from '../keywords/platform/entities/platform.entity';

@Injectable()
export class WataMappingService {
  async createKeywordMappings(
    transactionalEntityManager: EntityManager,
    wata: Wata,
    keywords: Keyword[],
  ) {
    if (!keywords || keywords.length === 0) {
      return null;
    }

    const created = keywords?.map((keyword: Keyword) => {
      return {
        keyword,
        wata,
      } as WataKeywordMapping;
    });

    if (!created) return null;

    return await transactionalEntityManager.save(WataKeywordMapping, created);
  }

  async createCautionMappings(
    transactionalEntityManager: EntityManager,
    wata: Wata,
    cautions: Caution[],
  ) {
    if (!cautions || cautions.length === 0) {
      return null;
    }

    const created = cautions?.map((caution: Caution) => {
      return {
        caution,
        wata,
      } as WataCautionMapping;
    });

    if (!created) return null;

    return await transactionalEntityManager.save(WataCautionMapping, created);
  }

  async createPlatformMappings(
    transactionalEntityManager: EntityManager,
    wata: Wata,
    platforms: PlatformWithUrlDto[],
  ) {
    if (!platforms || platforms.length === 0) {
      return null;
    }

    const created = platforms?.map((platform: PlatformWithUrlDto) => {
      return {
        platform: { id: platform.id } as Platform,
        url: platform.url,
        wata,
      } as WataPlatformMapping;
    });

    if (!created) return null;

    return await transactionalEntityManager.save(WataPlatformMapping, created);
  }

  async mergeMappings(entityManager, wata, updateItems, mappingEntityType) {
    const mappingParams = {
      wataFieldName: '',
      mappingFieldName: '',
      createMappingsHandler: undefined,
    };

    if (mappingEntityType === WataKeywordMapping) {
      mappingParams.wataFieldName = 'keywords';
      mappingParams.mappingFieldName = 'keyword';
      mappingParams.createMappingsHandler = this.createKeywordMappings;
    } else if (mappingEntityType === WataCautionMapping) {
      mappingParams.wataFieldName = 'cautions';
      mappingParams.mappingFieldName = 'caution';
      mappingParams.createMappingsHandler = this.createCautionMappings;
    } else if (mappingEntityType === WataPlatformMapping) {
      mappingParams.wataFieldName = 'platforms';
      mappingParams.mappingFieldName = 'platform';
      mappingParams.createMappingsHandler = this.createPlatformMappings;
    } else {
      throw new Error('잘못된 접근입니다.');
    }

    const addItems = updateItems?.filter(
      (item) =>
        !wata[mappingParams.wataFieldName].some(
          (mapping) => mapping[mappingParams.mappingFieldName].id === item.id,
        ),
    );

    const deleteItemIds = wata[mappingParams.wataFieldName]
      ?.filter(
        (mapping) =>
          !updateItems.some(
            (item) => item.id === mapping[mappingParams.mappingFieldName].id,
          ),
      )
      .map((value) => value.id);

    await mappingParams.createMappingsHandler(entityManager, wata, addItems);

    if (deleteItemIds.length > 0) {
      await entityManager.delete(mappingEntityType, deleteItemIds);
    }
  }
}
