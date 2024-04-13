import { Injectable } from '@nestjs/common';
import { KeywordService } from './keyword/keyword.service';
import { CautionService } from './caution/caution.service';
import { PlatformService } from './platform/platform.service';
import { CategoryService } from './category/category.service';
import { WataKeywordMapping } from '../wata/entities/wata-keyword.entity';
import { WataPlatformMapping } from '../wata/entities/wata-platform.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(WataKeywordMapping)
    private readonly keywordMappingRepository: Repository<WataKeywordMapping>,
    @InjectRepository(WataPlatformMapping)
    private readonly platformMappingRepository: Repository<WataPlatformMapping>,

    private readonly categoryService: CategoryService,
    private readonly keywordService: KeywordService,
    private readonly cautionService: CautionService,
    private readonly platformService: PlatformService,
  ) {}

  async findAll() {
    const categories = await this.categoryService.findAll();
    const keywords = await this.keywordService.findAll();
    const cautions = await this.cautionService.findAll();
    const platforms = await this.platformService.findAll();

    return { categories, keywords, cautions, platforms };
  }

  async findAllByCategory() {
    //todo : 조회 테이블을 publish_wata 로 변경

    const categories = await this.categoryService.findAll();

    const keywords = await this.keywordMappingRepository
      .createQueryBuilder('keywordMapping')
      .select('DISTINCT genre.category_id, keyword.id, keyword.name')
      .innerJoin('keywordMapping.wata', 'wata')
      .innerJoin('wata.genre', 'genre')
      .innerJoin('keywordMapping.keyword', 'keyword')
      .where('wata.is_published = :isPublished', { isPublished: true })
      .getRawMany();

    const platforms = await this.platformMappingRepository
      .createQueryBuilder('platformMapping')
      .select(
        'DISTINCT genre.category_id, platform.id, platform.name, platform.order_top',
      )
      .innerJoin('platformMapping.wata', 'wata')
      .innerJoin('wata.genre', 'genre')
      .innerJoin('platformMapping.platform', 'platform')
      .where('wata.is_published = :isPublished', { isPublished: true })
      .orderBy('platform.order_top', 'DESC')
      .addOrderBy('platform.name', 'ASC')
      .getRawMany();

    let genres = [];
    categories.forEach((c) => {
      genres = genres.concat(c.genres);
    });

    const allGenres = [];
    genres.forEach((g) => {
      if (!allGenres.some((ag) => ag.id === g.id)) {
        allGenres.push({ ...g, category_id: 0 });
      }
    });

    const allKeywords = [];
    keywords.forEach((k) => {
      if (!allKeywords.some((ak) => ak.id === k.id)) {
        allKeywords.push({ ...k, category_id: 0 });
      }
    });

    const allPlatforms = [];
    platforms.forEach((p) => {
      if (!allPlatforms.some((ap) => ap.id === p.id)) {
        allPlatforms.push({ ...p, category_id: 0 });
      }
    });

    const result = [
      {
        id: 0,
        name: '전체',
        genres: allGenres,
        keywords: allKeywords,
        platforms: allPlatforms,
      },
    ];

    return result.concat(
      categories?.map((category) => {
        const keywordsByCategory = keywords?.filter(
          (keyword) => keyword.category_id === category.id,
        );
        const platformsByCategory = platforms?.filter(
          (platform) => platform.category_id === category.id,
        );

        return {
          ...category,
          keywords: keywordsByCategory,
          platforms: platformsByCategory,
        };
      }),
    );
  }
}
