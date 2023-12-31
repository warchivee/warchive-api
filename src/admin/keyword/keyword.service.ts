import { Injectable } from '@nestjs/common';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { Keyword } from './entities/keyword.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from 'src/common/exception/service.exception';

@Injectable()
export class KeywordService {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
  ) {}

  create(createKeywordDto: CreateKeywordDto) {
    return this.keywordRepository.save({ ...createKeywordDto });
  }

  findAll() {
    return this.keywordRepository.find();
  }

  update(id: number, updateKeywordDto: UpdateKeywordDto) {
    return this.keywordRepository.save({ id, ...updateKeywordDto });
  }

  remove(id: number) {
    return this.keywordRepository.delete({ id });
  }

  async validate(ids: number[]) {
    if (!ids) return null;
    const keywords = await this.keywordRepository.find({
      where: { id: In(ids) },
    });

    if (keywords.length !== ids.length) {
      throw EntityNotFoundException('없는 키워드입니다.');
    }

    return keywords;
  }
}
