import { Injectable } from '@nestjs/common';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { Keyword } from './entities/keyword.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
}
