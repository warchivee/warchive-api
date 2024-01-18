import { Injectable } from '@nestjs/common';
import { KeywordService } from './keyword/keyword.service';
import { CautionService } from './caution/caution.service';
import { PlatformService } from './platform/platform.service';
import { CategoryService } from './category/category.service';

@Injectable()
export class KeywordsService {
  constructor(
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
}
